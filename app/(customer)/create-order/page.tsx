import CreateOrderForm from "@/components/app-components/order/create-order-form";

const page = () => {
  return (
    <main className="py-24 container mx-auto">
      <div className="w-full max-w-sm md:max-w-4xl mx-auto">
        <div className="pb-4 border-b">
          <h1 className="text-3xl font-bold text-foreground">
            Create New Order
          </h1>
        </div>
        <CreateOrderForm />
      </div>
    </main>
  );
}

export default page
