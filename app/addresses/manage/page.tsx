import { getAddresses } from "@/actions/addresses/get-addresses";
import ManageAddresses, { type address } from "@/components/app-components/manage-address"

const page = async () => {
  let addresses: address[];
  try {
    addresses = await getAddresses();
    return (
      <main className="pt-34 md:pt-24 container mx-auto px-4">
        <ManageAddresses addresses={addresses} />
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
  }
}

export default page
