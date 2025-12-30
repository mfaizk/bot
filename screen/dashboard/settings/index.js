"use client";
import { useState, useEffect } from "react";
import { User, Mail, Phone, Globe, Edit } from "lucide-react";
import CountryDropdown from "../../../components/country-dropdown";
import { updateProfileMutation, useUserProfile } from "@/queries/profile";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/queries/auth";
import ActivityIndicator from "@/components/activity-indicator";


export default function ProfileSettings() {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false); // ensure API data only applied once
  const {
    data: getUserData,
    isPending: getUserDataPending,
    refetch: userDataRefetch,
  } = useUserProfile();

  const countryOptions = [
    { value: "+1", label: "United States (+1)" },
    { value: "+44", label: "United Kingdom (+44)" },
    { value: "+1", label: "Canada (+1)" },
    { value: "+61", label: "Australia (+61)" },
    { value: "+91", label: "India (+91)" },
    { value: "+49", label: "Germany (+49)" },
    { value: "+33", label: "France (+33)" },
    { value: "+39", label: "Italy (+39)" },
    { value: "+34", label: "Spain (+34)" },
    { value: "+86", label: "China (+86)" },
    { value: "+81", label: "Japan (+81)" },
    { value: "+82", label: "South Korea (+82)" },
    { value: "+65", label: "Singapore (+65)" },
    { value: "+971", label: "United Arab Emirates (+971)" },
    { value: "+55", label: "Brazil (+55)" },
    { value: "+27", label: "South Africa (+27)" },
    { value: "+7", label: "Russia (+7)" },
    { value: "+31", label: "Netherlands (+31)" },
    { value: "+52", label: "Mexico (+52)" }
  ];
  
  
  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required."),
    email: Yup.string()
      .email("Enter a valid email.")
      .required("Email is required."),
    phone: Yup.string()
      .matches(/^\+?\d{6,15}$/, "Enter a valid phone number.")
      .required("Phone is required."),
    country: Yup.string().required("Select a country."),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        updateProfileMutate(values);

       
        
      } catch (err) {
        console.error(err);
        alert("Failed to update profile. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const { mutateAsync: updateProfileMutate, isPending: mutatePending } =
    useMutation({
      mutationFn: async (values) => {
        return updateProfileMutation({
          name: values?.name,
          countryCode: values?.country,
         
          mobileNumber: values?.phone,
        });
      },
      onSuccess: (data) => {
        if (data?.data?.responseCode == 200) {
          toast.success(data?.data?.responseMessage);
          userDataRefetch();
        } else {
          toast.error(data?.data?.responseMessage);
        }
      },
      onError: (err) => {
        console.log(err, "err>>>");
      },
    });

  // populate state when API data arrives (only once so user edits are not overwritten)
  useEffect(() => {
    if (getUserData && !initialized) {
      formik.setValues({
        name: getUserData.name ?? formik.values.name ?? "Ravi",
        email: getUserData.email ?? formik.values.email ?? "",
        phone: getUserData?.mobileNumber ?? formik.values.mobileNumber ?? "+91",
        country: getUserData.countryCode ?? formik.values.countryCode ?? "",
      });
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserData, initialized]);

  // Show loading until API finishes loading the initial data

  const {
    mutateAsync: forgotPasswordMutate,
    isPending: forgotPasswordMutatePending,
  } = useMutation({
    mutationFn: async () => {
      return forgotPassword({
        email: getUserData.email,
      });
    },
    onSuccess: (data) => {
      if (data?.data?.responseCode == 200) {
        toast.success(data?.data?.responseMessage);
        router.push(
          `/dashboard/settings/otp-screen?email=${encodeURIComponent(
            getUserData.email
          )}`
        );
      } else {
        toast.error(data?.data?.responseMessage);
      }
    },
    onError: (err) => {
      console.log(err, "err>>>");
    },
  });



  if (getUserDataPending && !initialized && forgotPasswordMutatePending) {
    return (
      <div className=" min-h-screen flex flex-col justify-center items-center gap-4">
        <ActivityIndicator isLoading className={"h-12 w-12"} />
        <p className="text-2xl font-semibold">Getting Data...</p>
      </div>
    );
  }


  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-[#13131e] p-8 rounded-2xl border border-gray-800 shadow-lg max-w-3xl mx-auto mt-10 "
    >
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-semibold text-white">
            {formik.values.name
              ? formik.values.name.charAt(0).toUpperCase()
              : "R"}
          </div>
          {/* <button
            type="button"
            className="absolute bottom-1 right-1 bg-[#1a1a25] border border-gray-600 p-2 rounded-full hover:bg-primary transition"
          >
            <Edit size={16} className="text-gray-300 hover:text-white" />
          </button> */}
        </div>

        <div>
          <h2 className="text-2xl font-semibold">{formik.values.name}</h2>
          <p className="text-gray-400">{formik.values.email}</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-6">Personal Information</h3>

      {/* First Name & Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <div className="flex items-center bg-[#1a1a25] rounded-xl px-3">
            <User className="text-gray-400 mr-2" size={18} />
            <input
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-transparent py-3 text-white outline-none"
              placeholder="First Name"
            />
          </div>
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>

        <div>
          <div className="flex items-center bg-[#1a1a25] rounded-xl px-3">
            <Mail className="text-gray-400 mr-2" size={18} />
            <input
              name="email"
              type="text"
              value={formik.values.email}
              disabled
              className="w-full bg-transparent py-3 text-gray-400 outline-none cursor-not-allowed"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>
      </div>

      {/* Phone & Country Dropdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <CountryDropdown
            label="Country"
            options={countryOptions}
            value={formik.values.country}
            onSelect={(val) => formik.setFieldValue("country", val)}
            className="w-full "
            
          />
          {formik.touched.country && formik.errors.country && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.country}</p>
          )}
        </div>

        <div>
          <div className="flex items-center bg-[#1a1a25] rounded-xl px-3">
            <Phone className="text-gray-400 mr-2" size={18} />
            <input
              name="phone"
              type="number"
              disabled={!formik.values.country}
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full bg-transparent py-3 text-white outline-none"
              placeholder="Phone Number"
            />
          </div>
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-center">
        <button
          type="submit"
          disabled={formik.isSubmitting || mutatePending}
          className="w-full bg-primary font-semibold text-white py-2 rounded-[10px] hover:opacity-90 transition-opacity"
        >
          {formik.isSubmitting || mutatePending ? "Updating..." : "Update"}
        </button>
      </div>
      <div className="flex mt-5  items-center justify-end">
        <button
          type="button"
          onClick={() => {
            //  router.push("/dashboard/settings/change-password")
            forgotPasswordMutate()
          }}
          className="inline-flex items-center gap-2 bg-[#1a1a25] border border-gray-700 py-2 px-4 rounded-xl text-sm text-gray-300 hover:bg-primary hover:text-white transition-all cursor-pointer"
        >
          <Globe size={16} />
          Change Password
        </button>
      </div>
    </form>
  );
}
