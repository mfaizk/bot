import { api } from "@/service/api-service";
import { useQuery } from "@tanstack/react-query";

export const contactUsMutation = async ({
  name,
  email,
  mobileNumber,
  countryCode,
  message,
}) => {
  try {
    console.log(mobileNumber, "mobileNumbermobileNumber");

    const response = await api({
      method: "POST",
      url: "/admin/contactUsAdd",
      data: {
        email: email || undefined,
        countryCode: countryCode || undefined,
        name: name || undefined,
        mobileNumber: mobileNumber || undefined,
        message: message || undefined,
      },
    });
    return response;
  } catch (error) {
    return error?.response;
  }
};
