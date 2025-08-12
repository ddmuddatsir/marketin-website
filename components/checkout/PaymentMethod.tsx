import {
  FaShieldAlt,
  FaTruck,
  FaMoneyBillWave,
  FaBoxOpen,
  FaCheckCircle,
} from "react-icons/fa";

export function PaymentMethod() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <FaCheckCircle className="text-green-500 w-6 h-6" />
        Payment & Shipping
      </h2>
      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="flex items-center gap-3 mb-3">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="COD"
            checked
            readOnly
            className="accent-green-600 w-4 h-4"
          />
          <label
            htmlFor="cod"
            className="text-base font-medium flex items-center gap-2"
          >
            <FaMoneyBillWave className="text-green-600 w-5 h-5" />
            Cash on Delivery (COD)
            <FaShieldAlt
              className="text-blue-500 w-5 h-5 ml-2"
              title="Secure Payment"
            />
          </label>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 ml-7">
          <FaTruck className="text-blue-600 w-4 h-4" />
          <span>Estimasi pengiriman 3-5 hari sampai</span>
          <FaBoxOpen
            className="text-yellow-500 w-4 h-4 ml-2"
            title="Fast Delivery"
          />
        </div>
      </div>
    </div>
  );
}
