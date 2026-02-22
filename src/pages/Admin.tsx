import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";
import {
  login,
  fetchEntity,
  createEntity,
  updateEntity,
  deleteEntity,
  getToken,
  setToken,
  clearToken,
} from "@/lib/api";

type TabKey = "bookings" | "teachers" | "subjects" | "schedule" | "reviews" | "contacts" | "logs";

interface EntityItem {
  id: number;
  [key: string]: unknown;
}

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "bookings", label: "Заявки", icon: "Inbox" },
  { key: "teachers", label: "Преподаватели", icon: "Users" },
  { key: "subjects", label: "Предметы", icon: "BookOpen" },
  { key: "schedule", label: "Расписание", icon: "Clock" },
  { key: "reviews", label: "Отзывы", icon: "Star" },
  { key: "contacts", label: "Контакты", icon: "Phone" },
  { key: "logs", label: "Логи", icon: "Terminal" },
];

const ENTITY_FIELDS: Partial<Record<TabKey, { key: string; label: string; type: string }[]>> = {
  bookings: [
    { key: "student_name", label: "Имя ученика", type: "text" },
    { key: "student_phone", label: "Телефон", type: "text" },
    { key: "student_email", label: "Email", type: "text" },
    { key: "selected_teacher", label: "Преподаватель", type: "text" },
    { key: "selected_subject", label: "Предмет", type: "text" },
    { key: "selected_time", label: "Время", type: "text" },
    { key: "status", label: "Статус", type: "select:new,in_progress,completed,cancelled" },
  ],
  teachers: [
    { key: "full_name", label: "ФИО", type: "text" },
    { key: "subject", label: "Предмет", type: "text" },
    { key: "experience_years", label: "Опыт (лет)", type: "number" },
    { key: "rating", label: "Рейтинг", type: "number" },
    { key: "phone", label: "Телефон", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "photo_url", label: "URL фото", type: "text" },
    { key: "description", label: "Описание", type: "textarea" },
    { key: "sort_order", label: "Порядок", type: "number" },
  ],
  subjects: [
    { key: "name", label: "Название", type: "text" },
    { key: "exam_type", label: "Тип экзамена", type: "text" },
  ],
  schedule: [
    { key: "time", label: "Время", type: "text" },
    { key: "title", label: "Название", type: "text" },
    { key: "description", label: "Описание", type: "textarea" },
    { key: "sort_order", label: "Порядок", type: "number" },
  ],
  reviews: [
    { key: "author_name", label: "Автор", type: "text" },
    { key: "rating", label: "Оценка (1-5)", type: "number" },
    { key: "review_text", label: "Текст отзыва", type: "textarea" },
    { key: "is_published", label: "Опубликован", type: "select:true,false" },
    { key: "sort_order", label: "Порядок", type: "number" },
  ],
  contacts: [
    { key: "type", label: "Тип", type: "select:phone,email,address,telegram,whatsapp" },
    { key: "value", label: "Значение", type: "text" },
    { key: "icon", label: "Иконка", type: "text" },
    { key: "label", label: "Название", type: "text" },
    { key: "sort_order", label: "Порядок", type: "number" },
  ],
};

const DISPLAY_FIELDS: Partial<Record<TabKey, string[]>> = {
  bookings: ["student_name", "student_phone", "selected_subject", "status", "created_at"],
  teachers: ["full_name", "subject", "experience_years", "rating"],
  subjects: ["name", "exam_type"],
  schedule: ["time", "title"],
  reviews: ["author_name", "rating", "is_published"],
  contacts: ["type", "value", "label"],
};

interface LogEntry {
  id: number;
  level: "log" | "warn" | "error" | "info";
  message: string;
  timestamp: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  completed: "Завершена",
  cancelled: "Отменена",
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("bookings");
  const [data, setData] = useState<Record<TabKey, EntityItem[]>>({
    bookings: [],
    teachers: [],
    subjects: [],
    schedule: [],
    reviews: [],
    contacts: [],
  });
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [editIsNew, setEditIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logFilter, setLogFilter] = useState<"all" | "log" | "warn" | "error">("all");
  const logIdRef = useRef(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((level: LogEntry["level"], args: unknown[]) => {
    const message = args
      .map((a) => {
        if (a instanceof Error) return `${a.name}: ${a.message}`;
        if (typeof a === "object") {
          try { return JSON.stringify(a, null, 2); } catch { return String(a); }
        }
        return String(a);
      })
      .join(" ");
    setLogs((prev) => {
      const next = [...prev, { id: ++logIdRef.current, level, message, timestamp: new Date().toLocaleTimeString("ru-RU") }];
      return next.slice(-500);
    });
  }, []);

  useEffect(() => {
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;
    const origInfo = console.info;
    console.log = (...args) => { origLog(...args); addLog("log", args); };
    console.warn = (...args) => { origWarn(...args); addLog("warn", args); };
    console.error = (...args) => { origError(...args); addLog("error", args); };
    console.info = (...args) => { origInfo(...args); addLog("info", args); };
    const onError = (e: ErrorEvent) => addLog("error", [`[Uncaught] ${e.message} (${e.filename}:${e.lineno})`]);
    const onUnhandled = (e: PromiseRejectionEvent) => addLog("error", [`[Promise] ${e.reason}`]);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandled);
    return () => {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
      console.info = origInfo;
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandled);
    };
  }, [addLog]);

  useEffect(() => {
    if (activeTab === "logs") {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, activeTab]);

  useEffect(() => {
    if (getToken()) {
      setIsAuth(true);
      loadAll();
    }
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const keys: TabKey[] = ["bookings", "teachers", "subjects", "schedule", "reviews", "contacts"];
    const results: Record<string, EntityItem[]> = {};
    for (const key of keys) {
      try {
        const res = await fetchEntity(key);
        results[key] = Array.isArray(res) ? res : [];
      } catch {
        results[key] = [];
      }
    }
    setData(results as Record<TabKey, EntityItem[]>);
    setLoading(false);
  };

  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      if (res.token) {
        setToken(res.token);
        setIsAuth(true);
        loadAll();
        toast({ title: "Добро пожаловать!" });
      } else {
        toast({ title: "Неверные данные", variant: "destructive" });
      }
    } catch {
      toast({ title: "Ошибка входа", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    clearToken();
    setIsAuth(false);
    navigate("/");
  };

  const openNew = () => {
    const item: Record<string, unknown> = {};
    ENTITY_FIELDS[activeTab].forEach((f) => {
      item[f.key] = f.type === "number" ? 0 : "";
    });
    setEditItem(item);
    setEditIsNew(true);
  };

  const openEdit = (item: EntityItem) => {
    setEditItem({ ...item });
    setEditIsNew(false);
  };

  const handleSave = async () => {
    if (!editItem) return;
    try {
      if (editIsNew) {
        await createEntity(activeTab, editItem);
        toast({ title: "Создано" });
      } else {
        await updateEntity(activeTab, editItem.id as number, editItem);
        toast({ title: "Сохранено" });
      }
      setEditItem(null);
      loadAll();
    } catch {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить запись?")) return;
    try {
      await deleteEntity(activeTab, id);
      toast({ title: "Удалено" });
      loadAll();
    } catch {
      toast({ title: "Ошибка удаления", variant: "destructive" });
    }
  };

  const formatCell = (key: string, value: unknown) => {
    if (key === "status" && typeof value === "string") {
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[value] || "bg-gray-100 text-gray-600"}`}>
          {STATUS_LABELS[value] || value}
        </span>
      );
    }
    if (key === "is_published") {
      return value ? (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Да</span>
      ) : (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Нет</span>
      );
    }
    if (key === "rating" && typeof value === "number") {
      return (
        <span className="flex items-center gap-1">
          <Icon name="Star" size={14} className="text-amber-400 fill-amber-400" />
          {value}
        </span>
      );
    }
    if (key === "created_at" && typeof value === "string") {
      return new Date(value).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }
    if (value === null || value === undefined) return "—";
    return String(value);
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <Card className="w-full max-w-sm shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl gradient-primary flex items-center justify-center">
              <Icon name="Shield" size={28} className="text-white" />
            </div>
            <CardTitle className="text-2xl">Админ-панель</CardTitle>
            <p className="text-sm text-muted-foreground">Войдите для управления сайтом</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full gradient-primary border-0 text-white">
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const items = (activeTab !== "logs" ? data[activeTab] : []) as EntityItem[];
  const fields = DISPLAY_FIELDS[activeTab] || [];
  const tabInfo = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} bg-slate-900 text-white flex flex-col transition-all shrink-0`}>
        <div className="p-4 flex items-center gap-3 border-b border-slate-700">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shrink-0">
            <Icon name="GraduationCap" size={18} className="text-white" />
          </div>
          {sidebarOpen && <span className="font-heading font-bold text-lg">Samur</span>}
        </div>
        <nav className="flex-1 py-3">
          {TABS.map((tab) => {
            const count = tab.key !== "logs" ? (data[tab.key as Exclude<TabKey, "logs">]?.length || 0) : 0;
            const isActive = activeTab === tab.key;
            const isBookingsNew = tab.key === "bookings" && data.bookings.filter((b) => b.status === "new").length > 0;
            const errorCount = tab.key === "logs" ? logs.filter((l) => l.level === "error").length : 0;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={tab.icon as "Inbox"} size={20} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{tab.label}</span>
                    <span className="flex items-center gap-1">
                      {isBookingsNew && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                      {errorCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white animate-pulse">{errorCount}</span>
                      )}
                      {tab.key !== "logs" && <span className="text-xs opacity-60">{count}</span>}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-400 hover:text-white">
            <Icon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={18} />
            {sidebarOpen && <span>Свернуть</span>}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-400 hover:text-red-400">
            <Icon name="LogOut" size={18} />
            {sidebarOpen && <span>Выйти</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Icon name={tabInfo.icon as "Inbox"} size={24} />
                {tabInfo.label}
              </h1>
              {activeTab !== "logs" && (
                <p className="text-sm text-muted-foreground mt-1">
                  {items.length} {items.length === 1 ? "запись" : "записей"}
                </p>
              )}
              {activeTab === "logs" && (
                <p className="text-sm text-muted-foreground mt-1">
                  {logs.length} записей · перехват console.log / warn / error
                </p>
              )}
            </div>
            {activeTab !== "bookings" && activeTab !== "logs" && (
              <Button onClick={openNew} className="gradient-primary border-0 text-white">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить
              </Button>
            )}
            {activeTab === "logs" && (
              <div className="flex items-center gap-2">
                {(["all", "log", "warn", "error"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setLogFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      logFilter === f
                        ? f === "error" ? "bg-red-500 text-white" : f === "warn" ? "bg-amber-500 text-white" : "bg-slate-700 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {f === "all" ? "Все" : f === "error" ? "Ошибки" : f === "warn" ? "Предупреждения" : "Инфо"}
                  </button>
                ))}
                <Button size="sm" variant="outline" onClick={() => setLogs([])}>
                  <Icon name="Trash2" size={14} className="mr-1" />
                  Очистить
                </Button>
              </div>
            )}
          </div>

          {activeTab === "logs" ? (
            <Card className="bg-slate-950 border-slate-800">
              <CardContent className="p-0">
                <div className="h-[calc(100vh-220px)] overflow-y-auto font-mono text-xs">
                  {logs.filter((l) => logFilter === "all" || l.level === logFilter).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                      <Icon name="Terminal" size={40} className="mb-3 opacity-40" />
                      <p>Логов пока нет. Взаимодействуй с сайтом — ошибки появятся здесь.</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-1">
                      {logs
                        .filter((l) => logFilter === "all" || l.level === logFilter)
                        .map((log) => (
                          <div key={log.id} className={`flex gap-3 py-1 border-b border-slate-900 ${
                            log.level === "error" ? "text-red-400" : log.level === "warn" ? "text-amber-400" : "text-slate-300"
                          }`}>
                            <span className="text-slate-600 shrink-0 w-16">{log.timestamp}</span>
                            <span className={`shrink-0 w-10 font-bold uppercase text-[10px] pt-[1px] ${
                              log.level === "error" ? "text-red-500" : log.level === "warn" ? "text-amber-500" : "text-slate-500"
                            }`}>{log.level}</span>
                            <span className="whitespace-pre-wrap break-all">{log.message}</span>
                          </div>
                        ))}
                      <div ref={logsEndRef} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : loading ? (
            <div className="flex items-center justify-center py-20">
              <Icon name="Loader2" size={32} className="animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                <Icon name="FolderOpen" size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg">Нет данных</p>
                {activeTab !== "bookings" && (
                  <Button variant="outline" className="mt-4" onClick={openNew}>
                    Добавить первую запись
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-slate-50">
                      <th className="text-left text-xs font-medium text-muted-foreground p-3 w-12">ID</th>
                      {fields.map((f) => (
                        <th key={f} className="text-left text-xs font-medium text-muted-foreground p-3 uppercase tracking-wide">
                          {ENTITY_FIELDS[activeTab]?.find((ef) => ef.key === f)?.label || f}
                        </th>
                      ))}
                      <th className="text-right text-xs font-medium text-muted-foreground p-3 w-24">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 text-sm text-muted-foreground">{item.id}</td>
                        {fields.map((f) => (
                          <td key={f} className="p-3 text-sm">{formatCell(f, item[f])}</td>
                        ))}
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                              <Icon name="Pencil" size={16} />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)}>
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editIsNew ? "Новая запись" : "Редактирование"}</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4 py-2">
              {(ENTITY_FIELDS[activeTab] || []).map((field) => {
                const val = editItem[field.key];
                if (field.type === "textarea") {
                  return (
                    <div key={field.key} className="space-y-1">
                      <label className="text-sm font-medium">{field.label}</label>
                      <Textarea
                        value={String(val || "")}
                        onChange={(e) => setEditItem({ ...editItem, [field.key]: e.target.value })}
                        rows={3}
                      />
                    </div>
                  );
                }
                if (field.type.startsWith("select:")) {
                  const options = field.type.replace("select:", "").split(",");
                  return (
                    <div key={field.key} className="space-y-1">
                      <label className="text-sm font-medium">{field.label}</label>
                      <Select
                        value={String(val || "")}
                        onValueChange={(v) => setEditItem({ ...editItem, [field.key]: v === "true" ? true : v === "false" ? false : v })}
                      >
                        <SelectTrigger><SelectValue placeholder="Выберите" /></SelectTrigger>
                        <SelectContent>
                          {options.map((o) => (
                            <SelectItem key={o} value={o}>
                              {STATUS_LABELS[o] || (o === "true" ? "Да" : o === "false" ? "Нет" : o)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }
                return (
                  <div key={field.key} className="space-y-1">
                    <label className="text-sm font-medium">{field.label}</label>
                    <Input
                      type={field.type === "number" ? "number" : "text"}
                      value={val === null || val === undefined ? "" : String(val)}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                        })
                      }
                    />
                  </div>
                );
              })}
              <div className="flex gap-3 pt-2 justify-end">
                <Button variant="outline" onClick={() => setEditItem(null)}>Отмена</Button>
                <Button onClick={handleSave} className="gradient-primary border-0 text-white">Сохранить</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;