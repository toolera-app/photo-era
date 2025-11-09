"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ModelSelector } from "./ModelSelector";
import { Badge, Text, Card, SimpleGrid } from "@mantine/core";

export function Dashboard() {
  const [selectedTool, setSelectedTool] = useState("ai-fashion-model");

  // Define the workflow cards similar to the UI in the image
  const workflowCards = [
    {
      id: "model-photography",
      title: "Generate On Model Photography",
      description: "Generate on model fashion photography",
      icon: "👗",
      imageSrc: "/placeholder-model.jpg",
      color: "green",
    },
    {
      id: "generate-ad",
      title: "Generate Ad",
      description: "Create custom ads with our graphic design engine",
      icon: "📢",
      imageSrc: "/placeholder-ad.jpg",
      color: "amber",
    },
    {
      id: "generate-video",
      title: "Generate Video",
      description: "Transform images into stunning video content",
      icon: "🎥",
      imageSrc: "/placeholder-video.jpg",
      color: "blue",
    },
    {
      id: "generate-image",
      title: "Generate Image",
      description: "Generate an image from a text prompt",
      icon: "🖼️",
      imageSrc: "/placeholder-image.jpg",
      color: "violet",
    },
    {
      id: "image-from-canvas",
      title: "Generate Image From Canvas",
      description: "Generate images by arranging assets",
      icon: "🎨",
      imageSrc: "/placeholder-canvas.jpg",
      color: "indigo",
    },
    {
      id: "train-custom-model",
      title: "Train Custom Model",
      description: "Train a custom model to generate images",
      icon: "🧠",
      imageSrc: "/placeholder-training.jpg",
      color: "red",
    },
  ];

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar */}
      <Sidebar selectedTool={selectedTool} onToolSelect={setSelectedTool} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header with Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6">Generate with workflows</h1>

            {/* Workflow Cards Grid */}
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {workflowCards.map((card) => (
                <Card
                  key={card.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  className="flex flex-col hover:shadow-md transition-all cursor-pointer"
                >
                  <Card.Section className="relative h-48">
                    <div className="absolute top-4 left-4 z-10">
                      <Badge color={card.color} size="lg" variant="light">
                        {card.icon} Create
                      </Badge>
                    </div>
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                      <Text size="lg" c="dimmed">
                        Image Preview
                      </Text>
                    </div>
                  </Card.Section>

                  <Text fw={600} size="lg" mt="md" mb="xs">
                    {card.title}
                  </Text>
                  <Text size="sm" color="dimmed" mb="md" className="flex-grow">
                    {card.description}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </div>

          {/* Products Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">
              Generate with Flair products
            </h2>
            {/* More product cards could go here */}
          </div>
        </div>
      </div>

      {/* Model Selector - only show for ai-fashion-model tool when that specific tool is clicked */}
      {/* {selectedTool === 'ai-fashion-model' && (
        <ModelSelector 
          selectedModel={selectedModel}
          onModelSelect={setSelectedModel}
        />
      )} */}
    </div>
  );
}
