import { z } from "zod";
import { abandonmentReasons, projectStatuses } from "../../domain/project";

const safeOptionalUrl = z.string().trim().refine((value) => {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}, "Enter a complete http:// or https:// URL.");

const optionalDate = z.string().refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), "Enter a valid date.");

export const projectFormSchema = z.object({
  name: z.string().trim().min(2, "Give the project a name.").max(80, "Keep the name under 80 characters."),
  shortDescription: z.string().trim().min(10, "Add a little more context (at least 10 characters).").max(240, "Keep this description under 240 characters."),
  intendedOutcome: z.string().trim().min(10, "Describe what you hoped to make.").max(600, "Keep the intended outcome under 600 characters."),
  technologies: z.array(z.string().trim().min(1)).max(12, "Keep the technology list focused."),
  repositoryUrl: safeOptionalUrl,
  demoUrl: safeOptionalUrl,
  workItems: z.array(z.object({ id: z.string().min(1), text: z.string().trim().min(2, "Describe this piece of work."), completed: z.boolean() })).min(1, "Add at least one completed or unfinished item."),
  status: z.enum(projectStatuses),
  startDate: optionalDate,
  lastWorkedDate: optionalDate,
  abandonmentReason: z.enum(abandonmentReasons),
  abandonmentNotes: z.string().trim().max(1000, "Keep these notes under 1,000 characters."),
  memoryCapsule: z.object({
    lastThingThatWorked: z.string().trim().max(500, "Keep this under 500 characters."),
    exactStoppingPoint: z.string().trim().max(500, "Keep this under 500 characters."),
    suggestedNextStep: z.string().trim().max(500, "Keep this under 500 characters."),
    importantLinks: z.array(z.object({ id: z.string().min(1), url: safeOptionalUrl.refine((value) => Boolean(value), "Enter a link or remove this row.") })).max(10),
    noteToFutureSelf: z.string().trim().max(800, "Keep this note under 800 characters."),
  }),
}).superRefine((values, context) => {
  if (values.startDate && values.lastWorkedDate && values.startDate > values.lastWorkedDate) {
    context.addIssue({ code: "custom", path: ["lastWorkedDate"], message: "Last worked cannot be before the start date." });
  }
  const today = new Date().toISOString().slice(0, 10);
  if (values.startDate && values.startDate > today) context.addIssue({ code: "custom", path: ["startDate"], message: "Start date cannot be in the future." });
  if (values.lastWorkedDate && values.lastWorkedDate > today) context.addIssue({ code: "custom", path: ["lastWorkedDate"], message: "Last worked cannot be in the future." });
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const emptyProjectFormValues: ProjectFormValues = {
  name: "",
  shortDescription: "",
  intendedOutcome: "",
  technologies: [],
  repositoryUrl: "",
  demoUrl: "",
  workItems: [
    { id: "initial-completed", text: "", completed: true },
    { id: "initial-unfinished", text: "", completed: false },
  ],
  status: "paused",
  startDate: "",
  lastWorkedDate: "",
  abandonmentReason: "lack-of-time",
  abandonmentNotes: "",
  memoryCapsule: { lastThingThatWorked: "", exactStoppingPoint: "", suggestedNextStep: "", importantLinks: [], noteToFutureSelf: "" },
};
