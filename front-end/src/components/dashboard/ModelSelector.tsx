"use client";

import { useState } from "react";
import { ModelType } from "@/types";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { Button, Text, Group, rem } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';

interface ModelSelectorProps {
  selectedModel: string | null;
  onModelSelect: (modelId: string) => void;
}

const femaleModels: ModelType[] = [
  {
    id: "female-1",
    name: "Adult Female 1",
    image: "/models/female-1.jpg",
    category: "female",
    subcategory: "Adult",
  },
  {
    id: "female-2",
    name: "Adult Female 2",
    image: "/models/female-2.jpg",
    category: "female",
    subcategory: "Adult",
  },
  {
    id: "female-3",
    name: "Adult Female 3",
    image: "/models/female-3.jpg",
    category: "female",
    subcategory: "Adult",
  },
  {
    id: "female-4",
    name: "Adult Female 4",
    image: "/models/female-4.jpg",
    category: "female",
    subcategory: "Adult",
  },
  {
    id: "female-5",
    name: "Adult Female 5",
    image: "/models/female-5.jpg",
    category: "female",
    subcategory: "Adult",
  },
  {
    id: "female-6",
    name: "Adult Female 6",
    image: "/models/female-6.jpg",
    category: "female",
    subcategory: "Adult",
  },
];

const maleModels: ModelType[] = [
  {
    id: "male-1",
    name: "Adult Male 1",
    image: "/models/male-1.jpg",
    category: "male",
    subcategory: "Adult",
  },
  {
    id: "male-2",
    name: "Adult Male 2",
    image: "/models/male-2.jpg",
    category: "male",
    subcategory: "Adult",
  },
];

export function ModelSelector({
  selectedModel,
  onModelSelect,
}: ModelSelectorProps) {
  const [activeTab, setActiveTab] = useState<"female" | "male">("female");

  const currentModels = activeTab === "female" ? femaleModels : maleModels;

  return (
    <div className="w-96 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <h1 className="text-2xl font-bold text-orange-500">Photography</h1>
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
            AI
          </span>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Upload Input Image
        </h2>

        {/* Mantine Dropzone */}
        <Dropzone
          onDrop={(files) => console.log('accepted files', files)}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={5 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
          style={{
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            backgroundColor: '#f9fafb',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <div className="flex flex-col items-center space-y-4">
                {/* Upload Icon */}
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <IconPhoto size={24} style={{ color: '#f97316' }} />
                </div>
                
                {/* Upload Button Style */}
                <Button 
                  variant="filled" 
                  style={{ 
                    backgroundColor: '#f97316',
                    color: 'white',
                    fontWeight: 500
                  }}
                  size="md"
                >
                  Choose Input Image
                </Button>
                
                {/* File Format Info */}
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  <Text fw={500} style={{ marginBottom: '4px' }}>JPG, PNG, WEBP</Text>
                  <Text>Click to browse or drag & drop</Text>
                </div>
              </div>
            </Dropzone.Idle>
          </Group>
        </Dropzone>
      </div>

     
    </div>
  );
}
