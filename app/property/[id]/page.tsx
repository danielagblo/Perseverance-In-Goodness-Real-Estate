import dbConnect from "@/lib/mongodb";
import Property from "@/models/Property";
import PropertyClientView from "./PropertyClientView";
import { notFound } from "next/navigation";

export default async function PropertyPage({ params }: { params: { id: string } }) {
  await dbConnect();
  
  let property;
  try {
    property = await Property.findById(params.id).lean();
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
