'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, ArrowLeft, ArrowRight, Plus, X, Check } from 'lucide-react'
import { toast } from 'sonner'

import { signUp } from '@/lib/firebase/auth'
import { setDocument } from '@/lib/firebase/firestore'
import {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
  registerStep4Schema,
  type RegisterStep1FormData,
  type RegisterStep2FormData,
  type RegisterStep3FormData,
  type RegisterStep4FormData,
} from '@/lib/validations/auth'
import {
  AGE_RANGES,
  CARE_RECEIVER_RELATIONSHIPS,
  LAGOS_AREAS,
  CONSULTATION_TIMES,
} from '@/lib/constants'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const STEPS = [
  'Account Info',
  'Care Receiver',
  'Medical & Care',
  'Location & Schedule',
  'Review',
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [conditionInput, setConditionInput] = useState('')

  const [formData, setFormData] = useState<{
    step1?: RegisterStep1FormData
    step2?: RegisterStep2FormData
    step3?: RegisterStep3FormData
    step4?: RegisterStep4FormData
  }>({})

  const step1Form = useForm<RegisterStep1FormData>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      email: '', password: '', confirmPassword: '',
      firstName: '', lastName: '', phone: '',
    },
  })

  const step2Form = useForm<RegisterStep2FormData>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: {
      careReceiverName: '', careReceiverPhone: '',
      careReceiverRelationship: '', occupation: '',
      careReceiverAgeRange: 'over-75',
    },
  })

  const step3Form = useForm<RegisterStep3FormData>({
    resolver: zodResolver(registerStep3Schema),
    defaultValues: {
      hasMedicalHistory: false, medicalConditions: [],
      careTypeNeeded: '', hasCurrentHMO: false, hmoProvider: null,
    },
  })

  const step4Form = useForm<RegisterStep4FormData>({
    resolver: zodResolver(registerStep4Schema),
    defaultValues: {
      careReceiverLocation: '', preferredConsultationTime: '',
      additionalInfo: '',
    },
  })

  function handleStep1(data: RegisterStep1FormData) {
    setFormData((prev) => ({ ...prev, step1: data }))
    setStep(1)
  }

  function handleStep2(data: RegisterStep2FormData) {
    setFormData((prev) => ({ ...prev, step2: data }))
    setStep(2)
  }

  function handleStep3(data: RegisterStep3FormData) {
    setFormData((prev) => ({ ...prev, step3: data }))
    setStep(3)
  }

  function handleStep4(data: RegisterStep4FormData) {
    setFormData((prev) => ({ ...prev, step4: data }))
    setStep(4)
  }

  function addCondition() {
    const trimmed = conditionInput.trim()
    if (!trimmed) return
    const current = step3Form.getValues('medicalConditions')
    if (!current.includes(trimmed)) {
      step3Form.setValue('medicalConditions', [...current, trimmed])
    }
    setConditionInput('')
  }

  function removeCondition(condition: string) {
    const current = step3Form.getValues('medicalConditions')
    step3Form.setValue(
      'medicalConditions',
      current.filter((c) => c !== condition)
    )
  }

  async function handleSubmit() {
    if (!formData.step1 || !formData.step2 || !formData.step3 || !formData.step4) return

    setIsLoading(true)
    try {
      const firebaseUser = await signUp(formData.step1.email, formData.step1.password)

      const userData = {
        uid: firebaseUser.uid,
        email: formData.step1.email,
        phone: formData.step1.phone,
        role: 'client' as const,
        status: 'pending' as const,
        firstName: formData.step1.firstName,
        lastName: formData.step1.lastName,
        notificationPrefs: { email: true, sms: false, push: false },
      }

      const profileData: Record<string, unknown> = {
        uid: firebaseUser.uid,
        occupation: formData.step2.occupation || '',
        careReceiver: {
          firstName: formData.step2.careReceiverName,
          lastName: '',
          ageRange: formData.step2.careReceiverAgeRange,
          relationship: formData.step2.careReceiverRelationship,
        },
        medicalHistory: formData.step3.medicalConditions ?? [],
        careType: [formData.step3.careTypeNeeded],
        location: {
          area: formData.step4.careReceiverLocation,
          lga: '',
          address: '',
        },
        consultationPrefs: {
          preferredDate: formData.step4.preferredConsultationDate.toISOString().split('T')[0],
          preferredTime: formData.step4.preferredConsultationTime,
          notes: formData.step4.additionalInfo || '',
        },
        emergencyContact: {
          name: formData.step2.careReceiverName,
          phone: formData.step2.careReceiverPhone,
          relationship: formData.step2.careReceiverRelationship,
        },
        languages: ['English'],
      }

      // Only include HMO fields if the user has one
      if (formData.step3.hasCurrentHMO && formData.step3.hmoProvider) {
        profileData.hmoProvider = formData.step3.hmoProvider
      }

      await setDocument('users', firebaseUser.uid, userData)
      await setDocument('clientProfiles', firebaseUser.uid, profileData)

      toast.success('Registration successful! Your account is pending approval.')
      router.push('/client/dashboard')
    } catch (error: unknown) {
      console.error(error)
      const message =
        error instanceof Error && error.message.includes('auth/email-already-in-use')
          ? 'An account with this email already exists'
          : 'Registration failed. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-lg mx-auto'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-heading'>Create an Account</CardTitle>
        <CardDescription>
          Step {step + 1} of {STEPS.length} &mdash; {STEPS[step]}
        </CardDescription>
        <div className='flex gap-1 mt-4'>
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {/* Step 1: Account Info */}
        {step === 0 && (
          <Form {...step1Form}>
            <form onSubmit={step1Form.handleSubmit(handleStep1)} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={step1Form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input placeholder='John' {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={step1Form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl><Input placeholder='Doe' {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={step1Form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type='email' placeholder='you@example.com' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step1Form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input placeholder='+2349012345678' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step1Form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type='password' placeholder='Min 8 characters' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step1Form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl><Input type='password' placeholder='Confirm your password' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Next <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </form>
          </Form>
        )}

        {/* Step 2: Care Receiver Details */}
        {step === 1 && (
          <Form {...step2Form}>
            <form onSubmit={step2Form.handleSubmit(handleStep2)} className='space-y-4'>
              <FormField
                control={step2Form.control}
                name='careReceiverName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Care Receiver&apos;s Name</FormLabel>
                    <FormControl><Input placeholder='Full name' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step2Form.control}
                name='careReceiverPhone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Care Receiver&apos;s Phone</FormLabel>
                    <FormControl><Input placeholder='+2349012345678' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step2Form.control}
                name='careReceiverRelationship'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship to Care Receiver</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder='Select relationship' /></SelectTrigger></FormControl>
                      <SelectContent>
                        {CARE_RECEIVER_RELATIONSHIPS.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step2Form.control}
                name='occupation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Occupation</FormLabel>
                    <FormControl><Input placeholder='What do you do?' {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={step2Form.control}
                name='careReceiverAgeRange'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Care Receiver&apos;s Age Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder='Select age range' /></SelectTrigger></FormControl>
                      <SelectContent>
                        {AGE_RANGES.map((a) => (
                          <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex gap-2'>
                <Button type='button' variant='outline' onClick={() => setStep(0)} className='flex-1'>
                  <ArrowLeft className='mr-2 h-4 w-4' /> Back
                </Button>
                <Button type='submit' className='flex-1'>
                  Next <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Step 3: Medical & Care Needs */}
        {step === 2 && (
          <Form {...step3Form}>
            <form onSubmit={step3Form.handleSubmit(handleStep3)} className='space-y-4'>
              <FormField
                control={step3Form.control}
                name='hasMedicalHistory'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                    <div>
                      <FormLabel>Does the care receiver have any medical history?</FormLabel>
                      <FormDescription>Toggle if yes</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {step3Form.watch('hasMedicalHistory') && (
                <FormField
                  control={step3Form.control}
                  name='medicalConditions'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Conditions</FormLabel>
                      <div className='flex gap-2'>
                        <Input
                          value={conditionInput}
                          onChange={(e) => setConditionInput(e.target.value)}
                          placeholder='Type a condition and press Add'
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCondition() } }}
                        />
                        <Button type='button' variant='outline' size='icon' onClick={addCondition}>
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {field.value.map((c) => (
                          <Badge key={c} variant='secondary' className='gap-1'>
                            {c}
                            <button type='button' onClick={() => removeCondition(c)}>
                              <X className='h-3 w-3' />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={step3Form.control}
                name='careTypeNeeded'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Care Needed</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder='Select care type' /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value='elderly_care'>Elderly Care</SelectItem>
                        <SelectItem value='personal_household'>Personal & Household Care</SelectItem>
                        <SelectItem value='premium_concierge'>Premium Concierge Care</SelectItem>
                        <SelectItem value='childcare'>Childcare</SelectItem>
                        <SelectItem value='postpartum'>Postpartum Care</SelectItem>
                        <SelectItem value='disability'>Disability Support</SelectItem>
                        <SelectItem value='post_surgery'>Post-Surgery Recovery</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step3Form.control}
                name='hasCurrentHMO'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between rounded-lg border p-4'>
                    <div>
                      <FormLabel>Does the care receiver have a current HMO?</FormLabel>
                      <FormDescription>Toggle if yes</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {step3Form.watch('hasCurrentHMO') && (
                <FormField
                  control={step3Form.control}
                  name='hmoProvider'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HMO / Healthcare Provider</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter provider name'
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className='flex gap-2'>
                <Button type='button' variant='outline' onClick={() => setStep(1)} className='flex-1'>
                  <ArrowLeft className='mr-2 h-4 w-4' /> Back
                </Button>
                <Button type='submit' className='flex-1'>
                  Next <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Step 4: Location & Schedule */}
        {step === 3 && (
          <Form {...step4Form}>
            <form onSubmit={step4Form.handleSubmit(handleStep4)} className='space-y-4'>
              <FormField
                control={step4Form.control}
                name='careReceiverLocation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Care Receiver&apos;s Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder='Select area in Lagos' /></SelectTrigger></FormControl>
                      <SelectContent>
                        {LAGOS_AREAS.map((area) => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step4Form.control}
                name='preferredConsultationDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Consultation Date</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        min={new Date().toISOString().split('T')[0]}
                        value={field.value ? field.value.toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step4Form.control}
                name='preferredConsultationTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Consultation Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder='Select time' /></SelectTrigger></FormControl>
                      <SelectContent>
                        {CONSULTATION_TIMES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={step4Form.control}
                name='additionalInfo'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Any Additional Information?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Share any other relevant information about the care receiver...'
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex gap-2'>
                <Button type='button' variant='outline' onClick={() => setStep(2)} className='flex-1'>
                  <ArrowLeft className='mr-2 h-4 w-4' /> Back
                </Button>
                <Button type='submit' className='flex-1'>
                  Review <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Step 5: Review & Submit */}
        {step === 4 && (
          <div className='space-y-6'>
            <div className='space-y-4'>
              <ReviewSection title='Account Info'>
                <ReviewField label='Name' value={`${formData.step1?.firstName} ${formData.step1?.lastName}`} />
                <ReviewField label='Email' value={formData.step1?.email} />
                <ReviewField label='Phone' value={formData.step1?.phone} />
              </ReviewSection>

              <ReviewSection title='Care Receiver Details'>
                <ReviewField label='Name' value={formData.step2?.careReceiverName} />
                <ReviewField label='Phone' value={formData.step2?.careReceiverPhone} />
                <ReviewField label='Relationship' value={formData.step2?.careReceiverRelationship} />
                <ReviewField label='Your Occupation' value={formData.step2?.occupation} />
                <ReviewField label='Age Range' value={AGE_RANGES.find((a) => a.value === formData.step2?.careReceiverAgeRange)?.label} />
              </ReviewSection>

              <ReviewSection title='Medical & Care Needs'>
                <ReviewField label='Medical History' value={formData.step3?.hasMedicalHistory ? 'Yes' : 'No'} />
                {formData.step3?.hasMedicalHistory && formData.step3.medicalConditions.length > 0 && (
                  <ReviewField label='Conditions' value={formData.step3.medicalConditions.join(', ')} />
                )}
                <ReviewField label='Care Type' value={formData.step3?.careTypeNeeded} />
                <ReviewField label='Current HMO' value={formData.step3?.hasCurrentHMO ? (formData.step3.hmoProvider ?? 'Yes') : 'No'} />
              </ReviewSection>

              <ReviewSection title='Location & Schedule'>
                <ReviewField label='Location' value={formData.step4?.careReceiverLocation} />
                <ReviewField label='Consultation Date' value={formData.step4?.preferredConsultationDate?.toLocaleDateString()} />
                <ReviewField label='Consultation Time' value={formData.step4?.preferredConsultationTime} />
                {formData.step4?.additionalInfo && (
                  <ReviewField label='Additional Info' value={formData.step4.additionalInfo} />
                )}
              </ReviewSection>
            </div>

            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => setStep(3)} className='flex-1'>
                <ArrowLeft className='mr-2 h-4 w-4' /> Back
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className='flex-1'>
                {isLoading ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  <Check className='mr-2 h-4 w-4' />
                )}
                Submit Registration
              </Button>
            </div>
          </div>
        )}

        <div className='mt-6 text-center text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link href='/login' className='text-primary font-medium hover:underline'>
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='rounded-lg border p-4 space-y-2'>
      <h3 className='text-sm font-semibold text-primary'>{title}</h3>
      <div className='space-y-1'>{children}</div>
    </div>
  )
}

function ReviewField({ label, value }: { label: string; value?: string }) {
  return (
    <div className='flex justify-between text-sm'>
      <span className='text-muted-foreground'>{label}</span>
      <span className='font-medium text-right max-w-[60%]'>{value ?? '-'}</span>
    </div>
  )
}
