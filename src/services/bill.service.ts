import axios from "axios";
import { getCarrier } from "../utils/networkCarrierChecker.util";

export default class BillService {
  async getSupportedBills() {
    try {
      const supportedBills = await axios.get(
        "https://api.flutterwave.com/v3/top-bill-categories",
        {
          params: {
            country: "NG",
          },
          headers: {
            Authorization: process.env.FLUTTERWAVE_SECRET,
          },
        }
      );

      return supportedBills.data;
    } catch (error) {}
  }

  async getBillCategory(billType: string) {
    try {
      const categoryInfo = await axios.get(
        `https://api.flutterwave.com/v3/bills/${billType}/billers`,
        {
          params: {
            country: "NG",
          },
          headers: {
            Authorization: process.env.FLUTTERWAVE_SECRET,
          },
        }
      );
      console.log(categoryInfo.data);
      return categoryInfo.data;
    } catch (error) {}
  }

  async buyAirtime(phoneNumber: string, amount: string) {
    try {
      const carrier = getCarrier(phoneNumber);
      const payLoad = {
        country: "NG",
        customer_id: `${phoneNumber}`,
        amount: Number(amount),
      };
      console.log(carrier);
      switch (carrier) {
        case "MTN NIGERIA":
          try {
            console.log("here");
            const mtnAirtime = await axios.post(
              `https://api.flutterwave.com/v3/billers/BIL099/items/AT099/payment`,
              payLoad,
              {
                headers: {
                  Authorization: process.env.FLUTTERWAVE_SECRET,
                },
              }
            );
            console.log(mtnAirtime.data);
            return mtnAirtime.data.status;
          } catch (error) {
            break;
          }

        case "GLO NIGERIA":
          try {
            const gloAirtime = await axios.post(
              `https://api.flutterwave.com/v3/billers/BIL102/items/AT102/payment`,
              payLoad,
              {
                headers: {
                  Authorization: process.env.FLUTTERWAVE_SECRET,
                },
              }
            );
            console.log(gloAirtime.data);
            return gloAirtime.data.status;
          } catch (error) {
            break;
          }

        case "AIRTEL NIGERIA":
          try {
            const airtelAirtime = await axios.post(
              `https://api.flutterwave.com/v3/billers/BIL100/items/AT100/payment`,
              payLoad,
              {
                headers: {
                  Authorization: process.env.FLUTTERWAVE_SECRET,
                },
              }
            );
            console.log(airtelAirtime.data);
            return airtelAirtime.data.status;
          } catch (error) {
            break;
          }

        case "9MOBILE NIGERIA":
          try {
            const etisalatAirtime = await axios.post(
              `https://api.flutterwave.com/v3/billers/BIL103/items/AT103/payment`,
              payLoad,
              {
                headers: {
                  Authorization: process.env.FLUTTERWAVE_SECRET,
                },
              }
            );
            console.log(etisalatAirtime.data);
            return etisalatAirtime.data.status;
          } catch (error) {
            break;
          }

        default:
          console.log("nothing");
          break;
      }
    } catch (error) {}
  }
}

// const bill = new BillService().buyAirtime("07064350087", "1500");
