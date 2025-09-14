import Layout from "@/components/Layout";
import ActivitiesModule from "@/components/ActivitiesModule";

export default function Activities() {
  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-7xl">
        <ActivitiesModule />
      </div>
    </Layout>
  );
}