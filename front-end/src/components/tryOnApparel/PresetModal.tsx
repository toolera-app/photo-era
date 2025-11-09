import React, { useState } from "react";
import { Modal, Button } from "@mantine/core";

interface PresetModalProps {
  opened: boolean;
  close: () => void;
}

const PresetModal = ({ opened, close }: PresetModalProps) => {
  return (
    <>
      <Modal opened={opened} onClose={close} title="Preset Options" centered>
        {/* Modal content goes here */}
        <div>
          <p>This is a Mantine modal for presets.</p>
        </div>
      </Modal>
    </>
  );
};

export default PresetModal;
