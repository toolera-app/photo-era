/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { IUpdateVendorMyProfileReq, IVendorFilterRequest, IUsersResponse, IUpdateVendorProfileStatus } from "./vendor.interface";
import { calculateProfileScore, getFilePathsByOriginalName } from "./vendor.utils";
import { IPaginationOptions } from "../../../../interfaces/pagination";
import { IGenericResponse } from "../../../../interfaces/common";
import { paginationHelpers } from "../../../../helpers/paginationHelper";
import prisma from "../../../../shared/prisma";
import ApiError from "../../../../errors/ApiError";
import config from "../../../../config";
import httpStatus from "http-status";
import { VendorRelationalFields, VendorRelationalFieldsMapper, VendorSearchableFields } from "./vendor.constants";
import { generateBusinessUserName } from "../../auth/auth.utils";

// ! Getting All Vendors  (ADMIN) ---------------------------------------->>>
const getAllVendorUsers = async (filters: IVendorFilterRequest, options: IPaginationOptions): Promise<IGenericResponse<IUsersResponse[]>> => {
  // Pagination
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.UserWhereInput[] = [];
  const vendorProfileFields = new Set(["businessName", "businessEmail", "businessPhoneNumber", "businessAddress", "businessDescription"]);

  // Search
  if (searchTerm) {
    andConditions.push({
      OR: VendorSearchableFields.map((field) => {
        const condition = {
          contains: searchTerm,
          mode: "insensitive",
        };
        return vendorProfileFields.has(field) ? { vendorProfile: { [field]: condition } } : { [field]: condition };
      }),
    });
  }

  // Filters
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (VendorRelationalFields.includes(key)) {
          return {
            vendorProfile: {
              [VendorRelationalFieldsMapper[key]]: {
                equals: (filterData as any)[key],
              },
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch Users (Paginated)
  const result = await prisma.user.findMany({
    where: {
      ...whereConditions,
      role: {
        has: UserRole.VENDOR, // changed from equals: [USER, VENDOR]
      },
    },
    select: {
      userId: true,
      userName: true,
      createdAt: true,
      email: true,
      role: true,
      personalPhoneNumber: true,
      firstName: true,
      lastName: true,
      IDNumber: true,
      personalPhoneNumberCountryCode: true,
      userStatus: true,
      updatedAt: true,
      vendorProfile: {
        include: {
          vendorBalance: {
            select: {
              availableAmount: true,
            },
          },
          _count: {
            select: {
              events: true,
              products: true,
              TicketOrderItem: true,
              ProductOrderItem: true,
            },
          },
        },
      },
    },
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { updatedAt: "desc" },
  });
  // Fetch total sales amount (unitPrice) for all vendors
  const ticketSales = await prisma.ticketOrderItem.groupBy({
    by: ["vendorProfileId"],
    where: {
      vendorProfileId: {
        not: null,
      },
    },
    _sum: {
      totalUnitPrice: true,
    },
  });

  const productSales = await prisma.productOrderItem.groupBy({
    by: ["vendorProfileId"],
    where: {
      vendorProfileId: {
        not: null,
      },
    },

    _sum: {
      totalUnitPrice: true,
    },
  });

  // Map vendorProfileId to sales amount
  const totalSalesMap = new Map<string, number>();

  ticketSales.forEach((item) => {
    totalSalesMap.set(item?.vendorProfileId as string, (totalSalesMap.get(item?.vendorProfileId as string) || 0) + (item._sum.totalUnitPrice || 0));
  });

  productSales.forEach((item) => {
    totalSalesMap.set(item.vendorProfileId as string, (totalSalesMap.get(item.vendorProfileId as string) || 0) + (item._sum.totalUnitPrice || 0));
  });

  const revenueByVendor = await prisma.paymentInformation.findMany({
    where: {
      paymentStatus: "SUCCEEDED",
    },
    include: {
      order: {
        select: {
          orderType: true,
          event: {
            select: {
              vendorProfileId: true,
            },
          },
          productOrderItems: {
            select: {
              vendorProfileId: true,
            },
          },
        },
      },
    },
  });

  const totalRevenueMap = new Map<string, number>();

  revenueByVendor.forEach((payment) => {
    const order = payment.order;

    if (!order) return;

    if (order.orderType === "EVENT") {
      const vendorId = order.event?.vendorProfileId;
      if (vendorId) {
        totalRevenueMap.set(vendorId, (totalRevenueMap.get(vendorId) || 0) + payment.grossAmount);
      }
    } else if (order.orderType === "PRODUCT") {
      const vendorIds = new Set(order.productOrderItems?.map((item) => item.vendorProfileId).filter(Boolean));

      // Split netRevenue across vendors
      const vendorShare = payment.grossAmount / vendorIds.size;

      vendorIds.forEach((vendorId) => {
        totalRevenueMap.set(vendorId as string, (totalRevenueMap.get(vendorId as string) || 0) + vendorShare);
      });
    }
  });

  // Enrich with stats
  const enrichedResult = result.map((user) => {
    const vendorProfileId = user.vendorProfile?.vendorProfileId;

    const totalRevenue = vendorProfileId ? totalRevenueMap.get(vendorProfileId) || 0 : 0;

    const totalSales = vendorProfileId ? totalSalesMap.get(vendorProfileId) || 0 : 0;

    return {
      ...user,
      vendorStats: {
        totalRevenue,
        totalSales,
        availableAmount: user.vendorProfile?.vendorBalance?.availableAmount || 0,
      },
    };
  });

  // Total count for pagination
  const total = await prisma.user.count({
    where: {
      ...whereConditions,
      role: {
        has: UserRole.VENDOR,
      },
    },
  });

  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: enrichedResult,
  };
};

// ! Getting All Vendors (BUSINESS) ---------------------------------->>>
const getAllOrganizers = async (filters: IVendorFilterRequest, options: IPaginationOptions): Promise<IGenericResponse<any[]>> => {
  // Calculate pagination options
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  // Destructure filter properties
  const { searchTerm, ...filterData } = filters;
  // Define an array to hold filter conditions
  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: VendorSearchableFields.map((field: any) => {
        if (field === "email") {
          return {
            email: {
              contains: searchTerm,
              mode: "insensitive",
            },
          } as Prisma.UserWhereInput;
        } else {
          return {
            [field]: {
              contains: searchTerm,
              mode: "insensitive",
            },
          } as Prisma.UserWhereInput;
        }
      }),
    } as Prisma.UserWhereInput);
  }

  // Add filterData conditions if filterData is provided
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (VendorRelationalFields.includes(key)) {
          return {
            vendorProfile: {
              events: {
                some: {
                  eventCategory: {
                    [VendorRelationalFieldsMapper[key]]: {
                      equals: (filterData as any)[key],
                    },
                  },
                },
              },
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  // Create a whereConditions object with AND conditions
  const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  // Retrieve   with filtering and pagination
  const result = await prisma.user.findMany({
    where: {
      role: {
        equals: [UserRole.USER, UserRole.VENDOR],
      },
      vendorProfile: {
        isVerified: true,
      },
      ...whereConditions,
    },
    select: {
      userName: true,
      bio: true,
      displayName: true,
      firstName: true,
      lastName: true,
      nationality: true,
      vendorProfile: {
        select: {
          businessUserName: true,
          logoImage: true,
          businessName: true,
          businessEmail: true,
          coverPhoto: true,
          isVerified: true,
          vendorProfileId: true,
          _count: {
            select: {
              events: {
                where: {
                  publishStatus: {
                    in: ["PUBLISHED"],
                  },
                },
              },
              products: {
                where: {
                  productStatus: {
                    in: ["ACTIVE"],
                  },
                },
              },
            },
          },
        },
      },
      userId: true,
    },

    skip,
    take: limit,
    // orderBy: options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { updatedAt: "desc" },
    orderBy: [
      { vendorProfile: { events: { _count: "desc" } } },
      { vendorProfile: { products: { _count: "desc" } } },
      options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { updatedAt: "desc" },
    ],
  });

  const total = await prisma.user.count({
    where: {
      role: {
        equals: [UserRole.USER, UserRole.VENDOR],
      },
      vendorProfile: {
        isVerified: true,
      },

      ...whereConditions,
    },
  });

  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// ! get single event organizer data -------------------------------------------------------->>>
const getEventOrganizerDetails = async (userNameOrId: string): Promise<any | null> => {
  const result = await prisma.user.findFirst({
    where: {
      OR: [
        { userName: userNameOrId },
        { userId: userNameOrId },
        {
          vendorProfile: {
            businessUserName: userNameOrId,
          },
        },
        {
          vendorProfile: {
            vendorProfileId: userNameOrId,
          },
        },
      ],
      role: {
        equals: [UserRole.USER, UserRole.VENDOR],
      },
    },
    omit: {
      password: true,
      eventBookingHistory: true,
      favoriteEvents: true,
      logsInfo: true,
      loginMethod: true,
      providerData: true,
      lastLogin: true,
      userStatus: true,
      role: true,
    },
    include: {
      vendorProfile: {
        omit: {
          businessRegistrationNumber: true,
          profileScore: true,
          isVerified: true,
        },
        include: {
          _count: true,
          events: {
            where: {
              isFeaturedFromOwner: {
                in: ["YES"],
              },
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Organizer Not Found !!");
  }

  return result;
};

//! get my profile (VENDOR) ----------------------------------------------------------------------->>>
const getMyProfile = async (userId: string): Promise<any | null> => {
  const result = await prisma.user.findUnique({
    where: {
      userId,
    },
    omit: {
      password: true,
    },
    include: {
      _count: true,
      vendorProfile: {
        select: {
          vendorProfileStatus: true,
          logoImage: true,
          businessType: true,
          socialMediaLinks: true,
          coverPhoto: true,
          businessName: true,
          businessUserName: true,
          businessAddress: true,
          businessEmail: true,
          businessPhoneNumber: true,
          businessDescription: true,
          businessPhoneNumberCountryCode: true,
          businessRegistrationNumber: true,
          isVerified: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not Found !!");
  }

  return result;
};

// ! update Profile info (VENDOR) -------------------------------------------------------->>>
const updateMyProfileInfo = async (vendorProfileId: string, userId: string, payload: IUpdateVendorMyProfileReq) => {
  const { firstName, lastName, newPassword, registeredEmail, logoImageName, personalPhoneNumber, coverPhotoName, businessName, files, ...others } = payload as IUpdateVendorMyProfileReq;

  const updatedUserDetails: any = {
    firstName,
    lastName,
    personalPhoneNumber,
    email: registeredEmail,
  };

  if (newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword as string, Number(config.bcrypt_salt_rounds));
    updatedUserDetails["password"] = hashedPassword;
  }
  // updating user data
  if (updatedUserDetails?.email || updatedUserDetails?.password) {
    await prisma.user.update({
      where: {
        userId,
      },
      data: updatedUserDetails,
    });
  }

  //

  const updatedDetailsReq: Partial<IUpdateVendorMyProfileReq> = {
    businessName,
    ...others,
  };

  if (businessName) {
    updatedDetailsReq["businessUserName"] = await generateBusinessUserName(businessName);
  }

  if (files?.length) {
    const paths = getFilePathsByOriginalName(files, logoImageName as string, coverPhotoName as string);

    updatedDetailsReq["logoImage"] = paths?.logoImagePath;
    updatedDetailsReq["coverPhoto"] = paths?.coverPhotoPath;
  }

  const result = await prisma.vendorProfile.update({
    where: {
      vendorProfileId,
    },
    data: updatedDetailsReq,
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  const profileScore = calculateProfileScore(result);

  // Update the profileScore
  const updatedDetails = await prisma.vendorProfile.update({
    where: { vendorProfileId },
    data: { profileScore, isVerified: profileScore >= 70 },
  });

  return updatedDetails;
};

// ! update vendor profile status (ADMIN)

const updateVendorProfileStatus = async (userId: string, payload: IUpdateVendorProfileStatus): Promise<any> => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const isExistVendor = await transactionClient.user.findUnique({
      where: {
        userId,
      },
      select: {
        userId: true,
        vendorProfile: {
          select: {
            vendorProfileId: true,
            vendorProfileStatus: true,
            reasonForChangeStatus: true,
          },
        },
      },
    });

    if (!isExistVendor?.vendorProfile?.vendorProfileId) {
      throw new ApiError(httpStatus.NOT_FOUND, "Vendor Profile not Found !!");
    }

    if (isExistVendor?.vendorProfile?.vendorProfileStatus === payload.vendorProfileStatus) {
      throw new ApiError(httpStatus.CONFLICT, `Status already updated to ${isExistVendor?.vendorProfile?.vendorProfileStatus}. Try a different one.`);
    }

    // Merge with existing log
    const previousLogRaw = isExistVendor.vendorProfile?.reasonForChangeStatus;
    const previousLog = Array.isArray(previousLogRaw) ? previousLogRaw : [];
    const updatedReasonForChangeStatus: Prisma.InputJsonValue = [
      ...previousLog,
      {
        status: payload.vendorProfileStatus,
        reason: payload.reasonForChangeStatus,
        date: new Date().toISOString(),
        updatedBy: "System",
      },
    ];

    //
    const updatedStatus: IUpdateVendorProfileStatus = {
      vendorProfileStatus: payload?.vendorProfileStatus,
      reasonForChangeStatus: updatedReasonForChangeStatus,
    };

    const updatedProfile = await transactionClient.vendorProfile.update({
      where: {
        vendorProfileId: isExistVendor?.vendorProfile?.vendorProfileId,
      },
      data: { ...updatedStatus, isVerified: payload?.vendorProfileStatus === "ACTIVE" },
      select: {
        vendorProfileId: true,
      },
    });

    return { ...updatedProfile, message: "Successfully Status Changed!" };
  });
  return result;
};

// ! getting single vendor data -------------------------------------------------------->>>
const getVendorDetails = async (slug: string): Promise<any | null> => {
  const result = await prisma.user.findFirst({
    where: {
      OR: [
        {
          userId: slug,
        },
        {
          userName: slug,
        },
        {
          vendorProfile: {
            businessUserName: slug,
          },
        },
      ],

      role: {
        equals: [UserRole.USER, UserRole.VENDOR],
      },
    },
    omit: {
      password: true,

      // vendorProfile: {
      //   include: {
      //     // Advertisement: true,
      //     // events: {
      //     //   include: {
      //     //     eventReviews: true,
      //     //     tableTypes: true,
      //     //     ticketTypes: true,
      //     //     eventCategory: true,
      //     //   },
      //     // },
      //     _count: true,
      //   },
      // },
      // createdAt: true,
      // updatedAt: true,
    },
    include: {
      _count: true,
      vendorProfile: {
        include: {
          _count: true,
          events: {
            where: {
              isFeaturedFromOwner: {
                in: ["YES"],
              },
            },
          },
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not Found !!");
  }

  return result;
};

// ! Close VENDOR UserAccount
const closeVendorUserAccount = async (userId: string): Promise<any> => {
  const userFind = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  if (!userFind) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not Found !!");
  }

  const result = await prisma.user.update({
    where: {
      userId: userFind.userId,
    },
    data: {
      userStatus: UserStatus.CLOSED,
    },
  });
  return result;
};

// ! --------------- exports Vendor user service
export const VendorUserService = {
  getAllVendorUsers,
  getAllOrganizers,
  getEventOrganizerDetails,
  getVendorDetails,
  updateMyProfileInfo,
  updateVendorProfileStatus,
  getMyProfile,
  closeVendorUserAccount,
};
