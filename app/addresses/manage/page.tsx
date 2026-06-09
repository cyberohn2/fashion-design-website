import { getAddresses } from "@/actions/addresses/get-addresses";
import ManageAddresses, { type address } from "@/components/app-components/manage-address"

const page = async () => {
  const addresses: address[] = await getAddresses();

  return (
    <main className="py-24 pt-34 md:pt-24">
      <ManageAddresses addresses={addresses} />
    </main>
  );
}

export default page
