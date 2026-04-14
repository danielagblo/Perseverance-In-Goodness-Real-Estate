import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyClientView from "./PropertyClientView";
import { notFound } from "next/navigation";

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  const { id } = await params;

  let property;
  try {
    property = await Property.findById(id).lean();
  } catch (error) {
    return notFound();
  }
  
  if (!property) {
    return notFound();
  }

  // Convert ObjectIds to strings for Client Component boundary
  const safeProperty = JSON.parse(JSON.stringify(property));

  return (
    <main>
      <PropertyClientView property={safeProperty} />
    </main>
  );
}
