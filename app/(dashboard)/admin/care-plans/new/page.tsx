"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useUsersByRole } from "@/lib/hooks/admin/useUsers";
import { createDocument, updateDocument } from "@/lib/firebase/firestore";
import {
  carePlanSchema,
  type CarePlanFormData,
} from "@/lib/validations/care-plan";
import { TASK_CATEGORIES } from "@/lib/constants";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewCarePlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const careRequestId = searchParams.get("careRequestId") ?? "";
  const preClientId = searchParams.get("clientId") ?? "";
  const { data: clients } = useUsersByRole("client");
  const { data: caregivers } = useUsersByRole("caregiver");
  const [isLoading, setIsLoading] = useState(false);

  const approvedClients = clients?.filter((c) => c.status === "approved") ?? [];
  const approvedCaregivers =
    caregivers?.filter((c) => c.status === "approved") ?? [];

  const form = useForm<CarePlanFormData>({
    resolver: zodResolver(carePlanSchema) as any,
    defaultValues: {
      title: "",
      clientId: preClientId,
      careRequestId: careRequestId || undefined,
      caregiverId: "",
      startDate: "",
      scheduleType: "daily",
      hoursPerDay: 8,
      startTime: "08:00",
      endTime: "16:00",
      tasks: [
        {
          title: "",
          category: "personal-care",
          frequency: "daily",
          isRequired: true,
          description: "",
        },
      ],
      specialInstructions: "",
      monthlyRate: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  async function onSubmit(data: CarePlanFormData) {
    setIsLoading(true);
    try {
      const tasks = data.tasks.map((t) => ({
        id: crypto.randomUUID(),
        title: t.title,
        category: t.category,
        frequency: t.frequency,
        isRequired: t.isRequired,
        description: t.description || undefined,
      }));

      await createDocument("carePlans", {
        clientId: data.clientId,
        careRequestId: data.careRequestId || "",
        caregiverId: data.caregiverId || "",
        status: "draft",
        title: data.title,
        startDate: data.startDate,
        schedule: {
          type: data.scheduleType,
          hoursPerDay: data.hoursPerDay,
          startTime: data.startTime,
          endTime: data.endTime,
        },
        tasks,
        specialInstructions: data.specialInstructions || "",
        monthlyRate: data.monthlyRate ?? 0,
        createdBy: "admin",
      });

      if (data.careRequestId) {
        await updateDocument("careRequests", data.careRequestId, {
          status: "care-plan-created",
        });
      }

      toast.success("Care plan created successfully!");
      router.push("/admin/care-plans");
    } catch (error) {
      console.error("Care plan creation error:", error);
      toast.error("Failed to create care plan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Care Plan"
        description="Create a care plan for a client"
      >
        <Button variant="outline" render={<Link href="/admin/care-plans" />}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
      </PageHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-3xl"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Daily Elderly Care Plan"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {approvedClients.map((c) => (
                            <SelectItem key={c.uid} value={c.uid}>
                              {c.firstName} {c.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="caregiverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caregiver (optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Assign later" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {approvedCaregivers.map((c) => (
                            <SelectItem key={c.uid} value={c.uid}>
                              {c.firstName} {c.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="scheduleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="live-in">Live-in</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="hoursPerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours/Day</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={24}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="monthlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Rate (₦)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Tasks</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      title: "",
                      category: "personal-care",
                      frequency: "daily",
                      isRequired: false,
                      description: "",
                    })
                  }
                >
                  <Plus className="mr-1 size-4" /> Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-md border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Task {index + 1}</p>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name={`tasks.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Morning bath" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`tasks.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TASK_CATEGORIES.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`tasks.${index}.frequency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="twice-daily">
                                Twice Daily
                              </SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="as-needed">
                                As Needed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`tasks.${index}.isRequired`}
                      render={({ field }) => (
                        <FormItem className="flex items-end gap-2 pb-2">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="size-4 rounded border-input"
                          />
                          <FormLabel className="mt-0!">Required</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              {form.formState.errors.tasks?.root && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.tasks.root.message}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="specialInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special notes or instructions..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Create Care Plan
          </Button>
        </form>
      </Form>
    </div>
  );
}
