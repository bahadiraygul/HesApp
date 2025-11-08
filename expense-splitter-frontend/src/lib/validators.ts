import { z } from "zod";

// Auth Schemas
export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email veya kullanıcı adı gerekli"),
  password: z.string().min(1, "Şifre gerekli"),
});

export const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  username: z
    .string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalı")
    .max(20, "Kullanıcı adı en fazla 20 karakter olabilir")
    .regex(/^[a-zA-Z0-9_]+$/, "Sadece harf, rakam ve alt çizgi kullanılabilir"),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalı")
    .regex(/[A-Z]/, "En az bir büyük harf içermeli")
    .regex(/[a-z]/, "En az bir küçük harf içermeli")
    .regex(/[0-9]/, "En az bir rakam içermeli")
    .regex(/[^A-Za-z0-9]/, "En az bir özel karakter içermeli"),
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı").max(50),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı").max(50),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalı").max(50).optional(),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalı").max(50).optional(),
  email: z.string().email("Geçerli bir email adresi girin").optional(),
  username: z
    .string()
    .min(3, "Kullanıcı adı en az 3 karakter olmalı")
    .max(20, "Kullanıcı adı en fazla 20 karakter olabilir")
    .regex(/^[a-zA-Z0-9_]+$/, "Sadece harf, rakam ve alt çizgi kullanılabilir")
    .optional(),
});

// Group Schemas
export const createGroupSchema = z.object({
  name: z.string().min(3, "Grup adı en az 3 karakter olmalı").max(100),
  description: z.string().max(500, "Açıklama en fazla 500 karakter olabilir").optional(),
  currency: z.string().default("TRY"),
});

export const updateGroupSchema = z.object({
  name: z.string().min(3, "Grup adı en az 3 karakter olmalı").max(100).optional(),
  description: z.string().max(500).optional(),
  currency: z.string().optional(),
});

export const addMemberSchema = z.object({
  userId: z.string().uuid("Geçerli bir kullanıcı ID'si girin"),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"], {
    message: "Rol ADMIN veya MEMBER olmalı",
  }),
});

// Expense Schemas
export const expenseSplitSchema = z.object({
  userId: z.string().uuid("Geçerli bir kullanıcı ID'si girin"),
  amount: z.number().positive("Tutar pozitif olmalı"),
});

export const createExpenseSchema = z.object({
  description: z.string().min(3, "Açıklama en az 3 karakter olmalı").max(200),
  amount: z.number().positive("Tutar pozitif olmalı"),
  currency: z.string().default("TRY"),
  category: z.string().max(50).optional(),
  date: z.string().datetime().or(z.date()),
  groupId: z.string().uuid("Geçerli bir grup ID'si girin"),
  splits: z
    .array(expenseSplitSchema)
    .min(1, "En az bir kişi seçilmeli")
    .refine(
      (splits) => {
        const total = splits.reduce((sum, split) => sum + split.amount, 0);
        return total > 0;
      },
      { message: "Toplam tutar 0'dan büyük olmalı" }
    ),
});

export const updateExpenseSchema = z.object({
  description: z.string().min(3).max(200).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().optional(),
  category: z.string().max(50).optional(),
  date: z.string().datetime().or(z.date()).optional(),
  splits: z.array(expenseSplitSchema).min(1).optional(),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseSplitInput = z.infer<typeof expenseSplitSchema>;
