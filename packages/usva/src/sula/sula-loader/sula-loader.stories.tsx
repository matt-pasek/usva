import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { SulaLoader } from "./sula-loader.js";

const meta: Meta<typeof SulaLoader> = {
  title: "Sula/Loader",
  component: SulaLoader,
};
export default meta;

type Story = StoryObj<typeof SulaLoader>;

function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-56 items-center justify-center gap-10 bg-bg p-10">
      {children}
    </div>
  );
}

export const Orbit: Story = {
  render: () => (
    <Stage>
      <SulaLoader size={96} motion="orbit" />
    </Stage>
  ),
};

export const Cluster: Story = {
  render: () => (
    <Stage>
      <SulaLoader size={96} motion="cluster" />
    </Stage>
  ),
};

export const Twin: Story = {
  render: () => (
    <Stage>
      <SulaLoader size={96} motion="twin" />
    </Stage>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Stage>
      <SulaLoader size={32} />
      <SulaLoader size={48} />
      <SulaLoader size={72} />
      <SulaLoader size={112} />
    </Stage>
  ),
};

export const Static: Story = {
  render: () => (
    <Stage>
      <SulaLoader size={72} motion="orbit" fluid={false} />
      <SulaLoader size={72} motion="cluster" fluid={false} />
      <SulaLoader size={72} motion="twin" fluid={false} />
    </Stage>
  ),
};
