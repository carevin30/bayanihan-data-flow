import Layout from "@/components/Layout";
import SettingsModule from "@/components/SettingsModule";

export default function Settings() {
  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-7xl">
        <SettingsModule />
      </div>
    </Layout>
  );
}