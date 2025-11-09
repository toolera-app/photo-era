"use client";

import { Text, NavLink, Badge } from "@mantine/core";
import { IconShirt, IconHelp } from "@tabler/icons-react";
import Link from "next/link";

interface IconProps {
  size?: number;
  stroke?: number;
  color?: string;
}

interface AITool {
  id: string;
  name: string;
  icon: React.ComponentType<IconProps>;
  isPro?: boolean;
  description: string;
  href?: string;
}

const aiTools: AITool[] = [
  {
    id: "ai-fashion-model",
    name: "Virtual try-on(Apparel)",
    icon: IconShirt,
    isPro: true,
    description: "Generate AI fashion models",
    href: "/try-on-apparel",
  },

  {
    id: "color-change",
    name: "Color Change",
    icon: IconShirt,
    description: "Modify clothing colors",
  },
  {
    id: "enhance",
    name: "Enhance",
    icon: IconShirt,
    isPro: true,
    description: "Enhance photo quality",
  },
  {
    id: "remove-background",
    name: "Remove Background",
    icon: IconShirt,
    description: "Remove photo backgrounds",
  },
  // {
  //   id: "generate-background",
  //   name: "Generate Background",
  //   icon: "🎭",
  //   isPro: true,
  //   description: "Generate new backgrounds",
  // },
  {
    id: "history",
    name: "History",
    icon: IconShirt,
    description: "View generation history",
  },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">PE</span>
          </div>
          <span className="text-xl font-bold text-green-600">PhotoEra</span>

          {/* User Button - Can be implemented later */}
          <div className="flex-grow flex justify-end">
            <button className="w-8 h-8 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center">
              <span className="font-semibold text-sm">R</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="mb-4 px-2">
          <Text fw={600} size="sm" c="dimmed">
            TOOLS
          </Text>
        </div>
        <div className="space-y-1">
          {aiTools.map((tool) => (
            <NavLink
              key={tool.id}
              component={Link}
              href={`${tool.href || "#"}`}
              // active={selectedTool === tool.id}
              // onClick={() => onToolSelect(tool.id)}
              leftSection={<tool.icon size={20} />}
              // rightSection={
              //   tool.isPro && (
              //     <Badge size="sm" variant="light" color="green">
              //       Pro
              //     </Badge>
              //   )
              // }
              label={tool.name}
              className="rounded-md"
            />
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="px-4 py-6 mt-auto border-t border-gray-200">
        <NavLink
          leftSection={<IconHelp size={20} />}
          label="Need Help?"
          className="rounded-md"
        />
      </div>
    </div>
  );
}
