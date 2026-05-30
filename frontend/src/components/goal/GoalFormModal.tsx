import { useState, useEffect } from 'react'
import { GoalCategory } from '@/constants/goal-category.constants'
import { Button, Input, Modal, TextareaInput } from '@/dls'

export interface GoalFormData {
  title: string
  description: string
  category: GoalCategory
  targetValue: number
  unit: string
}

interface GoalFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: GoalFormData) => void
  initialData?: GoalFormData
  mode?: 'add' | 'edit'
}

const categories: { value: GoalCategory; label: string }[] = [
  { value: GoalCategory.Health, label: 'Health' },
  { value: GoalCategory.Fitness, label: 'Fitness' },
  { value: GoalCategory.Finance, label: 'Finance' },
  { value: GoalCategory.Learning, label: 'Learning' },
  { value: GoalCategory.Career, label: 'Career' },
  { value: GoalCategory.Relationships, label: 'Relationships' },
  { value: GoalCategory.Creativity, label: 'Creativity' },
  { value: GoalCategory.Mindfulness, label: 'Mindfulness' },
  { value: GoalCategory.Other, label: 'Other' },
]

const defaultFormData: GoalFormData = {
  title: '',
  description: '',
  category: GoalCategory.Other,
  targetValue: 0,
  unit: '',
}

export function GoalFormModal({ isOpen, onClose, onSubmit, initialData, mode = 'add' }: GoalFormModalProps) {
  const [formData, setFormData] = useState<GoalFormData>(initialData || defaultFormData)
  const [errors, setErrors] = useState<Partial<Record<keyof GoalFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || defaultFormData)
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen, initialData])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GoalFormData, string>> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    else if (formData.title.length > 100) newErrors.title = 'Title must be less than 100 characters'
    if (formData.targetValue <= 0) newErrors.targetValue = 'Target value must be greater than 0'
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || isSubmitting) return
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof GoalFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'add' ? 'Add New Goal' : 'Edit Goal'}>
      <form onSubmit={handleSubmit} className="space-y-5 p-4">
        <Input label="Title" id="title" type="text" value={formData.title} onChange={(e) => handleChange('title', e.target.value)} error={errors.title} placeholder="e.g., Run 100 miles" autoFocus />

        <TextareaInput label="Description" id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Describe your goal..." rows={3} />

        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select id="category" value={formData.category} onChange={(e) => handleChange('category', e.target.value as GoalCategory)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sunrise-400 focus:outline-none focus:ring-2 focus:ring-sunrise-500/20">
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Target" id="targetValue" type="number" value={formData.targetValue || ''} onChange={(e) => handleChange('targetValue', Number(e.target.value))} error={errors.targetValue} placeholder="100" min="1" inputMode="numeric" />
          <Input label="Unit" id="unit" type="text" value={formData.unit} onChange={(e) => handleChange('unit', e.target.value)} error={errors.unit} placeholder="miles" />
        </div>

        <div className="pb-safe flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={isSubmitting}>
            {mode === 'add' ? 'Add Goal' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
