import { ProductType } from "@/components/app-components/catalog/product-card";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const DressCard = ({dress}: {dress: ProductType}) => {
  return (
    <div>
      <Card>
        <CardContent>
          <div className="flex gap-4 flex-col items-start md:flex-row">
            <Image
              src={dress.thumbnail || "/logo.webp"}
              alt="order-image"
              width={100}
              height={100}
            />
            <div>
              <p>{dress.title}</p>
              <p>{dress.description}</p>
            </div>
          </div>
          <div>
            <p>Sales: {dress.soldCount}</p>
            <p>Revenue: ₦{dress.soldCount * dress.base_price}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DressCard;
