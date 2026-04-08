import DashboardPageLoader from '@/components/dashboard/DashboardPageLoader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
    type TPortalService,
    type TPortalServiceStatus,
    type TPortalUser,
    useAdminAddPortalService,
    useAdminCreatePortalUser,
    useAdminDeletePortalService,
    useAdminDeletePortalUser,
    useAdminFetchPortalUser,
    useAdminFetchPortalUsers,
    useAdminUpdatePortalService,
    useAdminUpdatePortalUserStatus,
} from '@/services/useClientPortalService';
import { Copy, Eye, Loader2, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ClientPortalDashboardPageProps {
  language: 'en' | 'ar';
}

type ServiceDraft = {
  serviceName: string;
  status: TPortalServiceStatus;
  comment: string;
  adminDocuments: string[];
  customerDocuments: string[];
  adminDocInput: string;
  customerDocInput: string;
};

const emptyDraft = (): ServiceDraft => ({
  serviceName: '',
  status: 'PENDING',
  comment: '',
  adminDocuments: [],
  customerDocuments: [],
  adminDocInput: '',
  customerDocInput: '',
});

const ClientPortalDashboardPage = ({ language }: ClientPortalDashboardPageProps) => {
  const isArabic = language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [lastCreatedUser, setLastCreatedUser] = useState<TPortalUser | null>(null);

  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [serviceDrafts, setServiceDrafts] = useState<Record<string, ServiceDraft>>({});
  const [newServiceDraft, setNewServiceDraft] = useState<ServiceDraft>(emptyDraft);

  const usersQuery = useAdminFetchPortalUsers(searchTerm.trim() || undefined);
  const createUserMutation = useAdminCreatePortalUser();
  const deleteUserMutation = useAdminDeletePortalUser();
  const updateStatusMutation = useAdminUpdatePortalUserStatus();

  const userDetailsQuery = useAdminFetchPortalUser(viewUserId ?? undefined, Boolean(viewUserId));
  const addServiceMutation = useAdminAddPortalService();
  const updateServiceMutation = useAdminUpdatePortalService();
  const deleteServiceMutation = useAdminDeletePortalService();

  const users = usersQuery.data?.data ?? [];
  const selectedUser = userDetailsQuery.data?.data;

  const statusBadgeClass = (status: string) => {
    if (status === 'ACTIVE') return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
    return 'bg-slate-500/10 text-slate-700 border-slate-500/30';
  };

  const serviceStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'IN_PROGRESS':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'REJECTED':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/30';
      default:
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
    }
  };

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = await createUserMutation.mutateAsync({ name: newUserName.trim() });
    setLastCreatedUser(result.data);
    setNewUserName('');
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const draftByServiceId = useMemo(() => {
    const map: Record<string, ServiceDraft> = {};
    (selectedUser?.services || []).forEach((service) => {
      map[service.id] = serviceDrafts[service.id] || {
        serviceName: service.serviceName,
        status: service.status,
        comment: service.comment,
        adminDocuments: [...service.adminDocuments],
        customerDocuments: [...service.customerDocuments],
        adminDocInput: '',
        customerDocInput: '',
      };
    });
    return map;
  }, [selectedUser?.services, serviceDrafts]);

  const setServiceDraft = (serviceId: string, updater: (prev: ServiceDraft) => ServiceDraft) => {
    setServiceDrafts((prev) => ({
      ...prev,
      [serviceId]: updater(prev[serviceId] || emptyDraft()),
    }));
  };

  const addDocToDraft = (
    serviceId: string,
    type: 'adminDocuments' | 'customerDocuments',
    inputKey: 'adminDocInput' | 'customerDocInput',
  ) => {
    setServiceDraft(serviceId, (prev) => {
      const value = prev[inputKey].trim();
      if (!value) return prev;
      if (prev[type].includes(value)) return { ...prev, [inputKey]: '' };
      return {
        ...prev,
        [type]: [...prev[type], value],
        [inputKey]: '',
      };
    });
  };

  const removeDocFromDraft = (
    serviceId: string,
    type: 'adminDocuments' | 'customerDocuments',
    url: string,
  ) => {
    setServiceDraft(serviceId, (prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== url),
    }));
  };

  const handleSaveService = async (service: TPortalService) => {
    if (!selectedUser) return;
    const draft = draftByServiceId[service.id];
    if (!draft?.serviceName.trim()) return;

    await updateServiceMutation.mutateAsync({
      userId: selectedUser.id,
      serviceId: service.id,
      payload: {
        serviceName: draft.serviceName.trim(),
        status: draft.status,
        comment: draft.comment,
        adminDocuments: draft.adminDocuments,
        customerDocuments: draft.customerDocuments,
      },
    });
  };

  const handleAddService = async () => {
    if (!selectedUser) return;
    if (!newServiceDraft.serviceName.trim()) return;

    await addServiceMutation.mutateAsync({
      userId: selectedUser.id,
      payload: {
        serviceName: newServiceDraft.serviceName.trim(),
        status: newServiceDraft.status,
        comment: newServiceDraft.comment,
        adminDocuments: newServiceDraft.adminDocuments,
        customerDocuments: newServiceDraft.customerDocuments,
      },
    });

    setNewServiceDraft(emptyDraft());
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{isArabic ? 'بوابة العملاء' : 'Client Portal'}</h2>
          <p className="text-sm text-muted-foreground">
            {isArabic
              ? 'إنشاء حسابات العملاء وإدارة الخدمات والمستندات والرسائل.'
              : 'Create client accounts and manage services, documents, and messages.'}
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {isArabic ? 'إنشاء عميل' : 'Create User'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isArabic ? 'إنشاء مستخدم جديد' : 'Create New Client User'}</DialogTitle>
              <DialogDescription>
                {isArabic
                  ? 'أدخل الاسم فقط. سيتم توليد الكود وكلمة المرور تلقائياً.'
                  : 'Provide only name. Unique code and password are auto-generated.'}
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-3" onSubmit={handleCreateUser}>
              <div className="space-y-2">
                <Label>{isArabic ? 'الاسم' : 'Name'}</Label>
                <Input
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder={isArabic ? 'اسم العميل' : 'Client name'}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isArabic ? 'جارٍ الإنشاء...' : 'Creating...'}
                  </>
                ) : isArabic ? (
                  'إنشاء'
                ) : (
                  'Create'
                )}
              </Button>
            </form>

            {lastCreatedUser ? (
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                <p className="font-medium">{isArabic ? 'بيانات الدخول' : 'Generated Credentials'}</p>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span>Code: {lastCreatedUser.uniqueCode}</span>
                    <Button size="sm" variant="outline" onClick={() => handleCopy(lastCreatedUser.uniqueCode)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span>Password: {lastCreatedUser.plainPassword}</span>
                    <Button size="sm" variant="outline" onClick={() => handleCopy(lastCreatedUser.plainPassword)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
          placeholder={isArabic ? 'بحث بالاسم أو الكود...' : 'Search by name or code...'}
        />
      </div>

      {usersQuery.isLoading && !usersQuery.data ? (
        <DashboardPageLoader />
      ) : (
        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{isArabic ? 'الاسم' : 'Name'}</TableHead>
                <TableHead>{isArabic ? 'الكود' : 'Code'}</TableHead>
                <TableHead>{isArabic ? 'كلمة المرور' : 'Password'}</TableHead>
                <TableHead>{isArabic ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{isArabic ? 'الخدمات' : 'Services'}</TableHead>
                <TableHead className="text-right">{isArabic ? 'إجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.uniqueCode}</TableCell>
                  <TableCell>{user.plainPassword}</TableCell>
                  <TableCell>
                    <Select
                      value={user.status}
                      onValueChange={(value: 'ACTIVE' | 'INACTIVE') =>
                        updateStatusMutation.mutateAsync({ userId: user.id, status: value })
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusBadgeClass(user.status)}>
                      {user.services.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => setViewUserId(user.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => deleteUserMutation.mutateAsync({ userId: user.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!users.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    {isArabic ? 'لا يوجد مستخدمون' : 'No users found'}
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={Boolean(viewUserId)} onOpenChange={(open) => !open && setViewUserId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{isArabic ? 'إدارة خدمات العميل' : 'Manage Client Services'}</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `${selectedUser.name} (${selectedUser.uniqueCode})`
                : isArabic
                  ? 'تحميل البيانات...'
                  : 'Loading user details...'}
            </DialogDescription>
          </DialogHeader>

          {userDetailsQuery.isLoading && !selectedUser ? (
            <DashboardPageLoader />
          ) : selectedUser ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-3">
                <h4 className="mb-3 font-medium">{isArabic ? 'إضافة خدمة جديدة' : 'Add New Service'}</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{isArabic ? 'اسم الخدمة' : 'Service Name'}</Label>
                    <Input
                      value={newServiceDraft.serviceName}
                      onChange={(e) => setNewServiceDraft((prev) => ({ ...prev, serviceName: e.target.value }))}
                      placeholder={isArabic ? 'مثال: رخصة تجارية' : 'e.g. Business License'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isArabic ? 'الحالة' : 'Status'}</Label>
                    <Select
                      value={newServiceDraft.status}
                      onValueChange={(value: TPortalServiceStatus) =>
                        setNewServiceDraft((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">PENDING</SelectItem>
                        <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                        <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                        <SelectItem value="REJECTED">REJECTED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <Label>{isArabic ? 'رسالة الإدارة' : 'Admin Message'}</Label>
                  <Textarea
                    value={newServiceDraft.comment}
                    onChange={(e) => setNewServiceDraft((prev) => ({ ...prev, comment: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button onClick={handleAddService} disabled={addServiceMutation.isPending}>
                    {addServiceMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span className="ml-2">{isArabic ? 'إضافة خدمة' : 'Add Service'}</span>
                  </Button>
                </div>
              </div>

              {(selectedUser.services || []).map((service) => {
                const draft = draftByServiceId[service.id];

                return (
                  <div key={service.id} className="rounded-lg border p-3">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <Badge variant="outline" className={serviceStatusBadgeClass(draft.status)}>
                        {draft.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          deleteServiceMutation.mutateAsync({
                            userId: selectedUser.id,
                            serviceId: service.id,
                          })
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {isArabic ? 'حذف الخدمة' : 'Delete Service'}
                      </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{isArabic ? 'اسم الخدمة' : 'Service Name'}</Label>
                        <Input
                          value={draft.serviceName}
                          onChange={(e) =>
                            setServiceDraft(service.id, (prev) => ({
                              ...prev,
                              serviceName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{isArabic ? 'الحالة' : 'Status'}</Label>
                        <Select
                          value={draft.status}
                          onValueChange={(value: TPortalServiceStatus) =>
                            setServiceDraft(service.id, (prev) => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">PENDING</SelectItem>
                            <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                            <SelectItem value="REJECTED">REJECTED</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <Label>{isArabic ? 'رسالة الإدارة' : 'Admin Message'}</Label>
                      <Textarea
                        value={draft.comment}
                        onChange={(e) =>
                          setServiceDraft(service.id, (prev) => ({ ...prev, comment: e.target.value }))
                        }
                        rows={3}
                      />
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{isArabic ? 'مستندات الإدارة' : 'Admin Documents'}</Label>
                        <div className="flex gap-2">
                          <Input
                            value={draft.adminDocInput}
                            onChange={(e) =>
                              setServiceDraft(service.id, (prev) => ({
                                ...prev,
                                adminDocInput: e.target.value,
                              }))
                            }
                            placeholder="https://example.com/file.pdf"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addDocToDraft(service.id, 'adminDocuments', 'adminDocInput')}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {draft.adminDocuments.map((url) => (
                            <div key={url} className="flex items-center justify-between gap-2 rounded border p-2 text-xs">
                              <a href={url} target="_blank" rel="noreferrer" className="truncate text-primary underline">
                                {url}
                              </a>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removeDocFromDraft(service.id, 'adminDocuments', url)}
                              >
                                {isArabic ? 'حذف' : 'Remove'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{isArabic ? 'مستندات العميل' : 'Customer Documents'}</Label>
                        <div className="flex gap-2">
                          <Input
                            value={draft.customerDocInput}
                            onChange={(e) =>
                              setServiceDraft(service.id, (prev) => ({
                                ...prev,
                                customerDocInput: e.target.value,
                              }))
                            }
                            placeholder="https://example.com/file.pdf"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addDocToDraft(service.id, 'customerDocuments', 'customerDocInput')}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {draft.customerDocuments.map((url) => (
                            <div key={url} className="flex items-center justify-between gap-2 rounded border p-2 text-xs">
                              <a href={url} target="_blank" rel="noreferrer" className="truncate text-primary underline">
                                {url}
                              </a>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() => removeDocFromDraft(service.id, 'customerDocuments', url)}
                              >
                                {isArabic ? 'حذف' : 'Remove'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Button
                        onClick={() => handleSaveService(service)}
                        disabled={updateServiceMutation.isPending}
                      >
                        {isArabic ? 'حفظ التحديثات' : 'Save Updates'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{isArabic ? 'لا توجد بيانات' : 'No data available'}</p>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ClientPortalDashboardPage;
