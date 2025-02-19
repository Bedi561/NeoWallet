import { Suspense } from "react";
import CategoryForm from "@/components/ui/category-form";

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryForm />
    </Suspense>
  );
}
