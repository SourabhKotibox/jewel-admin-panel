/**
 * Contact Us page CMS — hero, info cards, form labels, visit CTA.
 */

import {
  makeSectionLayoutHelpers,
  mergeFieldsFromCms,
  createCustomSection,
} from "./pageCmsKit";

export const CONTACT_FIELD_GROUPS = [
  {
    id: "hero",
    label: "1 · Hero",
    keys: ["heroEyebrow", "heroTitle", "heroSubtitle", "heroImage"],
  },
  {
    id: "info",
    label: "2 · Contact details",
    keys: [
      "phoneLabel",
      "phoneValue",
      "emailLabel",
      "emailValue",
      "addressLabel",
      "addressValue",
      "hoursLabel",
      "hoursValue",
      "whatsappLabel",
      "whatsappNumber",
    ],
  },
  {
    id: "form",
    label: "3 · Inquiry form",
    keys: [
      "formTitle",
      "formSubtitle",
      "nameLabel",
      "emailFieldLabel",
      "phoneFieldLabel",
      "messageLabel",
      "messagePlaceholder",
      "submitCta",
      "successMessage",
    ],
  },
  {
    id: "visit",
    label: "4 · Visit / boutiques CTA",
    keys: ["visitEyebrow", "visitTitle", "visitBody", "visitCta", "visitCtaLink", "visitImage"],
  },
];

export const defaultContactFields = {
  heroEyebrow: "Get in Touch",
  heroTitle: "Contact Us",
  heroSubtitle:
    "Speak with our jewellery consultants for private viewings, bridal appointments, and worldwide inquiries.",
  heroImage:
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1600&auto=format&fit=crop",

  phoneLabel: "Call",
  phoneValue: "+91 96195 87978",
  emailLabel: "Email",
  emailValue: "hello@madhujewellery.com",
  addressLabel: "Atelier",
  addressValue: "Madhu Jewellery, India — private appointments by request",
  hoursLabel: "Hours",
  hoursValue: "Mon–Sat · 11:00 AM – 7:00 PM IST",
  whatsappLabel: "WhatsApp",
  whatsappNumber: "919619587978",

  formTitle: "Send an Inquiry",
  formSubtitle: "Share a few details and we will respond on WhatsApp.",
  nameLabel: "Full name",
  emailFieldLabel: "Email",
  phoneFieldLabel: "Phone",
  messageLabel: "Message",
  messagePlaceholder: "Tell us about the piece, occasion, or appointment you’d like…",
  submitCta: "Send via WhatsApp",
  successMessage: "Opening WhatsApp with your message…",

  visitEyebrow: "Visit Us",
  visitTitle: "Book a Boutique Appointment",
  visitBody:
    "Prefer to see pieces in person? Browse our boutiques and request a private viewing.",
  visitCta: "View Stores",
  visitCtaLink: "/stores",
  visitImage:
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop",
};

export const BUILTIN_CONTACT_SECTIONS = [
  { id: "hero", label: "Hero", adminGroups: ["hero"] },
  { id: "info", label: "Contact details", adminGroups: ["info"] },
  { id: "form", label: "Inquiry form", adminGroups: ["form"] },
  { id: "visit", label: "Visit CTA", adminGroups: ["visit"] },
];

const helpers = makeSectionLayoutHelpers(BUILTIN_CONTACT_SECTIONS);

export const defaultContactSectionLayout = helpers.defaultLayout;
export const normalizeContactSectionLayout = helpers.normalize;
export const extractContactSectionLayout = helpers.extract;
export const contactAdminGroupToSectionId = helpers.adminGroupToSectionId;
export const isContactSectionHidden = helpers.isHidden;
export const createContactCustomSection = createCustomSection;

export function fieldsToCmsContact(fields, sectionLayout) {
  return {
    ...defaultContactFields,
    ...fields,
    sectionLayout: normalizeContactSectionLayout(sectionLayout),
  };
}

export function cmsContactToFields(cms = {}) {
  return mergeFieldsFromCms(defaultContactFields, cms);
}
