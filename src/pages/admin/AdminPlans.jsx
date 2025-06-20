import { useState, useEffect } from 'react'
import { Edit2, Trash2, Plus, Users } from 'lucide-react'
import AdminLayout from '../../components/admin/AdminLayout'
import DataTable from '../../components/admin/DataTable'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Switch } from '../../components/ui/switch'
import { apiService } from '../../services/api'
import { toast } from 'sonner'

function AdminPlans() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const data = await apiService.getAdminPlans()
      setPlans(data.plans)
    } catch (error) {
      toast.error('Failed to fetch plans: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = () => {
    setEditingPlan({
      name: '',
      slug: '',
      description: '',
      price: '',
      max_file_size_mb: '',
      monthly_transcriptions: '',
      total_prompts: '',
      is_active: true
    })
    setIsCreateDialogOpen(true)
  }

  const handleEditPlan = (plan) => {
    setEditingPlan({ ...plan })
    setIsEditDialogOpen(true)
  }

  const handleSavePlan = async (e) => {
    e.preventDefault()
    try {
      const planData = {
        name: editingPlan.name,
        slug: editingPlan.slug,
        description: editingPlan.description,
        price: parseFloat(editingPlan.price),
        max_file_size_mb: parseInt(editingPlan.max_file_size_mb),
        monthly_transcriptions: parseInt(editingPlan.monthly_transcriptions),
        total_prompts: parseInt(editingPlan.total_prompts),
        is_active: editingPlan.is_active
      }

      if (editingPlan.id) {
        await apiService.updateAdminPlan(editingPlan.id, planData)
        toast.success('Plan updated successfully')
        setIsEditDialogOpen(false)
      } else {
        await apiService.createAdminPlan(planData)
        toast.success('Plan created successfully')
        setIsCreateDialogOpen(false)
      }
      
      setEditingPlan(null)
      fetchPlans()
    } catch (error) {
      toast.error('Failed to save plan: ' + error.message)
    }
  }

  const handleDeletePlan = async (planId) => {
    try {
      await apiService.deleteAdminPlan(planId)
      toast.success('Plan deleted successfully')
      fetchPlans()
    } catch (error) {
      toast.error('Failed to delete plan: ' + error.message)
    }
  }

  const columns = [
    {
      key: 'name',
      title: 'Plan',
      render: (value, plan) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{plan.slug}</div>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (value) => `$${parseFloat(value).toFixed(2)}`
    },
    {
      key: 'monthly_transcriptions',
      title: 'Monthly Limit',
      render: (value) => value === 0 ? 'Unlimited' : value
    },
    {
      key: 'max_file_size_mb',
      title: 'Max File Size',
      render: (value) => `${value} MB`
    },
    {
      key: 'subscriptions_count',
      title: 'Subscribers',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {value || 0}
        </div>
      )
    },
    {
      key: 'is_active',
      title: 'Status',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, plan) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditPlan(plan)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Plan</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the "{plan.name}" plan? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeletePlan(plan.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    }
  ]

  const PlanForm = ({ plan, onSave, onCancel }) => (
    <form onSubmit={onSave} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            value={plan.name}
            onChange={(e) => setEditingPlan(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={plan.slug}
            onChange={(e) => setEditingPlan(prev => ({ ...prev, slug: e.target.value }))}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={plan.description}
          onChange={(e) => setEditingPlan(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={plan.price}
            onChange={(e) => setEditingPlan(prev => ({ ...prev, price: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="max_file_size_mb">Max File Size (MB)</Label>
          <Input
            id="max_file_size_mb"
            type="number"
            value={plan.max_file_size_mb}
            onChange={(e) => setEditingPlan(prev => ({ ...prev, max_file_size_mb: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="monthly_transcriptions">Monthly Transcriptions</Label>
          <Input
            id="monthly_transcriptions"
            type="number"
            value={plan.monthly_transcriptions}
            onChange={(e) => setEditingPlan(prev => ({ ...prev, monthly_transcriptions: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="total_prompts">Total Prompts</Label>
          <Input
            id="total_prompts"
            type="number"
            value={plan.total_prompts}
            onChange={(e) => setEditingPlan(prev => ({ ...prev, total_prompts: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={plan.is_active}
          onCheckedChange={(checked) => setEditingPlan(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {plan.id ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </form>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Plans</h1>
            <p className="text-muted-foreground">Manage subscription plans and pricing</p>
          </div>
          <Button onClick={handleCreatePlan}>
            <Plus className="mr-2 h-4 w-4" />
            Create Plan
          </Button>
        </div>

        <DataTable
          data={plans}
          columns={columns}
          loading={loading}
        />

        {/* Create Plan Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
            </DialogHeader>
            {editingPlan && (
              <PlanForm
                plan={editingPlan}
                onSave={handleSavePlan}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Plan Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Plan</DialogTitle>
            </DialogHeader>
            {editingPlan && (
              <PlanForm
                plan={editingPlan}
                onSave={handleSavePlan}
                onCancel={() => setIsEditDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

export default AdminPlans