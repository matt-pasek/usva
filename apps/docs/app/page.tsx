import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
} from "@matt-pasek/usva";
import Link from "next/link";
import { ThemeSwitcher } from "../components/ThemeSwitcher";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-10">
      <h1 className="text-3xl font-semibold">usva.</h1>
      <Link href="/design-language" className="text-sm text-accent">
        design language →
      </Link>
      <ThemeSwitcher />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            Primitives <Badge tone="accent">alpha</Badge>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Button>solid</Button>
            <Button variant="ghost">ghost</Button>
          </div>
          <Input aria-label="demo" placeholder="type here" />
        </CardBody>
      </Card>
    </main>
  );
}
