// Clean Staff Registration Component
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiSettings, FiUpload, FiAlertCircle, FiSave, FiPlus, FiX, FiDollarSign, FiClock, FiFileText, FiBriefcase } from 'react-icons/fi';
import { StaffFormData, StaffRole, Department, StaffStatus } from '../../types/staff';

// Styled Components
const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.04);
`;

const Heading = styled.h1`
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #111827;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #111827;
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Req = styled.span`
  color: #dc2626;
`;

const Input = styled.input<{error?: boolean}>`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${p => p.error ? '#f87171' : '#d1d5db'};
  border-radius: 8px;
  font-size: 0.875rem;
  background: #fff;
  transition: border 0.15s, box-shadow 0.15s;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
  }
`;

const Select = styled.select<{error?: boolean}>`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${p => p.error ? '#f87171' : '#d1d5db'};
  border-radius: 8px;
  font-size: 0.875rem;
  background: #fff;
  transition: border 0.15s, box-shadow 0.15s;
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, #6b7280 50%),
                    linear-gradient(135deg, #6b7280 50%, transparent 50%);
  background-position: calc(100% - 16px) calc(50% + 2px),
                       calc(100% - 12px) calc(50% + 2px);
  background-size: 4px 4px, 4px 4px;
  background-repeat: no-repeat;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
  }
`;

const Textarea = styled.textarea<{error?: boolean}>`
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid ${p => p.error ? '#f87171' : '#d1d5db'};
  border-radius: 8px;
  font-size: 0.875rem;
  background: #fff;
  transition: border 0.15s, box-shadow 0.15s;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
  }
`;

const ErrorMsg = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #dc2626;
  font-size: 0.7rem;
  font-weight: 500;
`;

const Help = styled.div`
  font-size: 0.65rem;
  color: #6b7280;
`;

const Inline = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
`;

const Chip = styled.span`
  background: #eef2ff;
  color: #4338ca;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
`;

const UploadBox = styled.div`
  border: 2px dashed #d1d5db;
  padding: 1.25rem;
  text-align: center;
  font-size: 0.8rem;
  color: #374151;
  border-radius: 10px;
  background: #f9fafb;
  cursor: pointer;
  transition: 0.15s;
  
  &:hover {
    border-color: #6366f1;
    background: #eef2ff;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const Button = styled.button<{primary?: boolean}>`
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
  border: 1px solid;
  transition: 0.15s;
  background: ${p => p.primary ? '#4f46e5' : '#fff'};
  color: ${p => p.primary ? '#fff' : '#374151'};
  border-color: ${p => p.primary ? '#4f46e5' : '#d1d5db'};
  
  &:hover:not(:disabled) {
    background: ${p => p.primary ? '#4338ca' : '#f3f4f6'};
    border-color: ${p => p.primary ? '#4338ca' : '#9ca3af'};
  }
  
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

// Component
const StaffRegistrationConsistent: React.FC = () => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<StaffFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      role: StaffRole.ADMIN,
      department: Department.ADMINISTRATION,
      dateOfJoining: '',
      profilePicture: undefined,
      documents: [],
      documentTypes: [],
      status: StaffStatus.ACTIVE,
      emergencyContact: '',
      bloodGroup: '',
      dateOfBirth: '',
      gender: 'MALE',
      salary: undefined,
      workingHours: '',
      supervisorId: undefined,
      societyId: 0,
      skills: []
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const docsInputRef = useRef<HTMLInputElement>(null);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const next = [...skills, newSkill.trim()];
      setSkills(next);
      setValue('skills', next);
      setNewSkill('');
    }
  };

  const removeSkill = (s: string) => {
    const next = skills.filter(x => x !== s);
    setSkills(next);
    setValue('skills', next);
  };

  const onDocs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const tooLarge = files.find(f => f.size > 5 * 1024 * 1024);
    if (tooLarge) {
      toast.error(`File ${tooLarge.name} > 5MB`);
      return;
    }
    setDocuments(p => [...p, ...files]);
  };

  const rmDoc = (i: number) => setDocuments(d => d.filter((_, idx) => idx !== i));

  const size = (b: number) => {
    if (!b) return '0 B';
    const k = 1024;
    const i = Math.floor(Math.log(b) / Math.log(k));
    const sizes = ['B', 'KB', 'MB', 'GB'];
    return `${(b / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const submit = async (data: StaffFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Staff submit', { ...data, documents, skills });
      toast.success('Staff registered');
    } catch (e) {
      console.error(e);
      toast.error('Submit failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Card>
        <Heading><FiUser /> Staff Registration</Heading>
        <form onSubmit={handleSubmit(submit)}>
          {/* Basic Information */}
          <Section>
            <SectionTitle><FiUser /> Basic Information</SectionTitle>
            <Grid>
              <Field>
                <Label><FiUser size={12} /> Name <Req>*</Req></Label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name required' }}
                  render={({ field }) => (
                    <Input {...field} error={!!errors.name} placeholder="Full name" />
                  )}
                />
                {errors.name && <ErrorMsg><FiAlertCircle size={12} /> {errors.name.message}</ErrorMsg>}
              </Field>
              <Field>
                <Label><FiMail size={12} /> Email <Req>*</Req></Label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: 'Email required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email'
                    }
                  }}
                  render={({ field }) => (
                    <Input type="email" {...field} error={!!errors.email} placeholder="email@domain.com" />
                  )}
                />
                {errors.email && <ErrorMsg><FiAlertCircle size={12} /> {errors.email.message}</ErrorMsg>}
              </Field>
              <Field>
                <Label><FiPhone size={12} /> Phone <Req>*</Req></Label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: 'Phone required' }}
                  render={({ field }) => (
                    <Input type="tel" {...field} error={!!errors.phone} placeholder="Phone number" />
                  )}
                />
                {errors.phone && <ErrorMsg><FiAlertCircle size={12} /> {errors.phone.message}</ErrorMsg>}
              </Field>
              <Field>
                <Label><FiCalendar size={12} /> Date of Birth</Label>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => <Input type="date" {...field} />}
                />
              </Field>
              <Field>
                <Label>Gender</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  )}
                />
              </Field>
              <Field>
                <Label>Blood Group</Label>
                <Controller
                  name="bloodGroup"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="">Select</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </Select>
                  )}
                />
              </Field>
            </Grid>
            <Field style={{ marginTop: '1rem' }}>
              <Label><FiMapPin size={12} /> Address <Req>*</Req></Label>
              <Controller
                name="address"
                control={control}
                rules={{ required: 'Address required' }}
                render={({ field }) => (
                  <Textarea {...field} error={!!errors.address} placeholder="Full address" />
                )}
              />
              {errors.address && <ErrorMsg><FiAlertCircle size={12} /> {errors.address.message}</ErrorMsg>}
            </Field>
          </Section>

          {/* Employment */}
          <Section>
            <SectionTitle><FiSettings /> Employment Details</SectionTitle>
            <Grid>
              <Field>
                <Label>Role <Req>*</Req></Label>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: 'Role required' }}
                  render={({ field }) => (
                    <Select {...field} error={!!errors.role}>
                      <option value="">Select role</option>
                      {Object.values(StaffRole).map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </Select>
                  )}
                />
                {errors.role && <ErrorMsg><FiAlertCircle size={12} /> {errors.role.message}</ErrorMsg>}
              </Field>
              <Field>
                <Label>Department <Req>*</Req></Label>
                <Controller
                  name="department"
                  control={control}
                  rules={{ required: 'Department required' }}
                  render={({ field }) => (
                    <Select {...field} error={!!errors.department}>
                      <option value="">Select department</option>
                      {Object.values(Department).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </Select>
                  )}
                />
                {errors.department && <ErrorMsg><FiAlertCircle size={12} /> {errors.department.message}</ErrorMsg>}
              </Field>
              <Field>
                <Label>Date of Joining <Req>*</Req></Label>
                <Controller
                  name="dateOfJoining"
                  control={control}
                  rules={{ required: 'Required' }}
                  render={({ field }) => (
                    <Input type="date" {...field} error={!!errors.dateOfJoining} />
                  )}
                />
                {errors.dateOfJoining && <ErrorMsg><FiAlertCircle size={12} /> {errors.dateOfJoining.message}</ErrorMsg>}
              </Field>
              <Field>
                <Label><FiDollarSign size={12} /> Salary</Label>
                <Controller
                  name="salary"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Annual"
                    />
                  )}
                />
              </Field>
              <Field>
                <Label><FiClock size={12} /> Working Hours</Label>
                <Controller
                  name="workingHours"
                  control={control}
                  render={({ field }) => <Input {...field} placeholder="e.g. 9-6" />}
                />
              </Field>
              <Field>
                <Label>Supervisor ID</Label>
                <Controller
                  name="supervisorId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      {...field}
                      onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="ID"
                    />
                  )}
                />
              </Field>
            </Grid>
          </Section>

          {/* Skills */}
          <Section>
            <SectionTitle><FiBriefcase /> Skills</SectionTitle>
            <Inline>
              <Input
                style={{ maxWidth: 240 }}
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add skill"
              />
              <Button type="button" onClick={addSkill}><FiPlus size={14} /> Add</Button>
              {skills.map(s => (
                <Chip key={s}>
                  {s}
                  <FiX size={12} style={{ cursor: 'pointer' }} onClick={() => removeSkill(s)} />
                </Chip>
              ))}
            </Inline>
            <Help style={{ marginTop: '.35rem' }}>Optional list of skills / expertise.</Help>
          </Section>

          {/* Documents */}
          <Section>
            <SectionTitle><FiUpload /> Documents</SectionTitle>
            <UploadBox onClick={() => docsInputRef.current?.click()}>
              <FiUpload style={{ marginBottom: 4 }} /> Click to upload (PDF/JPG/PNG &lt; 5MB each)
            </UploadBox>
            <input
              ref={docsInputRef}
              type="file"
              multiple
              hidden
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={onDocs}
            />
            {documents.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                {documents.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f3f4f6',
                      padding: '.5rem .75rem',
                      borderRadius: 8,
                      fontSize: '.7rem'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                      <FiFileText /> {f.name} <span style={{ color: '#6b7280' }}>({size(f.size)})</span>
                    </span>
                    <Button
                      type="button"
                      onClick={() => rmDoc(i)}
                      style={{ padding: '.35rem .6rem' }}
                    >
                      <FiX size={12} /> Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Actions>
            <Button type="reset">Reset</Button>
            <Button primary type="submit" disabled={isSubmitting}>
              <FiSave size={14} /> {isSubmitting ? 'Saving...' : 'Register Staff'}
            </Button>
          </Actions>
        </form>
      </Card>
    </Container>
  );
};

export default StaffRegistrationConsistent;