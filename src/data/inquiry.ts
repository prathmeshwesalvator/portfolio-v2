import type { SelectOption } from "@/types";

/** Project inquiry form options (Freelance mode). Edit freely. */
export const projectTypes: readonly SelectOption[] = [
  { value: "mobile-app", label: "Mobile app" },
  { value: "backend-api", label: "Backend / API" },
  { value: "full-stack", label: "Full-stack web app" },
  { value: "website", label: "Business website" },
  { value: "other", label: "Something else" },
];

/** Budget ranges in INR. Optional field. */
export const budgetRanges: readonly SelectOption[] = [
  { value: "", label: "Prefer not to say" },
  { value: "under-50k", label: "Under ₹50,000" },
  { value: "50k-1.5l", label: "₹50,000 – ₹1.5 lakh" },
  { value: "1.5l-5l", label: "₹1.5 lakh – ₹5 lakh" },
  { value: "5l-plus", label: "₹5 lakh +" },
  { value: "discuss", label: "Not sure yet — let's discuss" },
];

/** Validation limits shared by the client form and the delivery helpers. */
export const inquiryLimits = {
  nameMax: 80,
  emailMax: 254,
  descriptionMin: 20,
  descriptionMax: 2000,
} as const;
