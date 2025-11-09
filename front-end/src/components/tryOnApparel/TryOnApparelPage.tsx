"use client";

import React, { useState } from "react";
import {
  Container,
  SegmentedControl,
  Title,
  Group,
  Paper,
  Text,
  Stack,
  FileButton,
  Button,
} from "@mantine/core";
import topGarments from "@/assets/top-garments-example.webp";
import bottomGarments from "@/assets/bottom-garments-example.webp";
import Image from "next/image";
import { useDisclosure } from "@mantine/hooks";
import PresetModal from "./PresetModal";

// Define tab types for type safety
type TabValue = "top" | "bottom" | "one-piece";

const TryOnApparelPage = () => {
  const [activeTab, setActiveTab] = useState<TabValue>("top");
  const [opened, { open, close }] = useDisclosure(false);
  const [file, setFile] = useState<File | null>(null);

  const renderTabContent = () => {
    // Common layout for all tabs with tab-specific instructions
    const tabContent = {
      top: {
        title: "Upload Top Clothing",
        description:
          "Upload t-shirts, blouses, sweaters, and other upper body garments",
        acceptedTypes: "T-shirts, blouses, shirts, sweaters, jackets",
        recommendations:
          "For best results, use images with clear backgrounds and front-facing garments",
      },
      bottom: {
        title: "Upload Bottom Clothing",
        description:
          "Upload pants, shorts, skirts and other lower body garments",
        acceptedTypes: "Pants, jeans, shorts, skirts",
        recommendations:
          "For best results, use full-length images of the garment laid flat",
      },
      "full-body": {
        title: "Upload Full Body Outfit",
        description: "Upload complete outfits to try on models",
        acceptedTypes: "Coordinated top and bottom combinations",
        recommendations:
          "Ensure both top and bottom pieces are clearly visible in the image",
      },
      "one-piece": {
        title: "Upload One-Piece Garment",
        description: "Upload dresses, jumpsuits, and other one-piece garments",
        acceptedTypes: "Dresses, jumpsuits, rompers",
        recommendations:
          "For best results, use images with the full garment visible",
      },
    };

    const content = tabContent[activeTab];

    return (
      <Stack gap="xl">
        <Paper shadow="xs" p="xl" withBorder>
          <Group justify="space-between" align="flex-start">
            <div style={{ width: "60%" }}>
              <Title order={3} mb="md">
                {content.title}
              </Title>
              <Text size="md" mb="lg">
                {content.description}
              </Text>

              <Paper p="md" bg="gray.0" radius="md" mb="lg">
                <Stack gap="xs">
                  <Text fw={600} size="sm">
                    Accepted types:
                  </Text>
                  <Text size="sm">{content.acceptedTypes}</Text>
                  <Text fw={600} size="sm" mt="md">
                    Recommendations:
                  </Text>
                  <Text size="sm">{content.recommendations}</Text>
                </Stack>
              </Paper>

              {/* Upload controls */}
              <Group grow mb="md">
                <Paper
                  p="lg"
                  withBorder
                  style={{
                    borderStyle: "dashed",
                    borderColor: "#ced4da",
                    cursor: "pointer",
                  }}
                >
                  <Stack align="center" gap="xs">
                    <Text ta="center" c="dimmed">
                      Drag & drop or click to upload
                    </Text>
                    <Text size="xs" c="gray">
                      JPG, PNG, WEBP up to 5MB
                    </Text>
                  </Stack>
                </Paper>
              </Group>
            </div>

            <div style={{ width: "35%" }}>
              <Paper withBorder p="md" radius="md">
                <Stack gap="md">
                  <Title order={5}>Virtual Try-On Preview</Title>
                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      height: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "8px",
                    }}
                  >
                    <Text c="dimmed">Preview will appear here</Text>
                  </div>
                  <Text size="xs" c="dimmed" ta="center">
                    Select a model and upload a garment to generate a preview
                  </Text>
                </Stack>
              </Paper>
            </div>
          </Group>
        </Paper>
      </Stack>
    );
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-6 h-full">
        <div className="bg-white h-full p-4">
          <div className="">
            <SegmentedControl
              value={activeTab}
              onChange={(value) => setActiveTab(value as TabValue)}
              data={[
                { label: "Only Top", value: "top" },
                { label: "Only Bottom", value: "bottom" },
                //   { label: "Full Body", value: "full-body" },
                { label: "One-Piece Garment", value: "one-piece" },
              ]}
              size="sm"
              radius="md"
              color="green"
            />

            <div className="aspect-square border-2 border-dashed border-gray-400 h-full rounded-lg mt-4">
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <div>
                  <Image
                    src={activeTab === "top" ? topGarments : bottomGarments}
                    alt="Garment Example"
                    width={1080}
                    height={1080}
                    className="object-contain h-24 w-24"
                  />
                </div>

                <h2 className="font-bold">Upload Top Garment Image</h2>
                <p className="text-sm">
                  Upload size: 512*512 - 2048*2048, less than 10M
                </p>

                <FileButton onChange={setFile} accept="image/png,image/jpeg">
                  {(props) => <Button {...props}>Upload image</Button>}
                </FileButton>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-white">
          <div className="flex flex-col h-full justify-center items-center gap-5">
            <Button variant="light" color="dark" onClick={open}>
              Select from modal library
            </Button>
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
              {(props) => <Button {...props}>Upload model image</Button>}
            </FileButton>
          </div>
        </div>
      </div>
      <PresetModal opened={opened} close={close} />
      {/* <div className="tab-content p-4">{renderTabContent()}</div> */}
    </>
  );
};

export default TryOnApparelPage;
