import { z } from 'zod';

export const quoteRequestSchema = z.object({
  clientName: z.string().min(2, 'Le nom est requis'),
  clientEmail: z.string().email('Email invalide'),
  clientPhone: z.string().min(6, 'Numéro de téléphone invalide'),
  clientAddress: z.string().optional(),
  serviceType: z.string().min(1, 'Sélectionnez une prestation'),
  description: z.string().min(10, 'Merci de décrire votre besoin (10 caractères min.)'),
});

export const loginRequestSchema = z.object({
  email: z.string().email('Email invalide'),
});

export const lineItemSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, 'Libellé requis'),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
});

export const quoteUpdateSchema = z.object({
  clientName: z.string().min(2).optional(),
  clientEmail: z.string().email().optional(),
  clientPhone: z.string().min(6).optional(),
  clientAddress: z.string().optional(),
  serviceType: z.string().optional(),
  description: z.string().optional(),
  lineItems: z.array(lineItemSchema).optional(),
});

export const companySchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  siret: z.string().min(1),
  tvaNumber: z.string().min(1),
  description: z.string().min(1),
  cities: z.array(z.string()),
  logoUrl: z.string().optional().nullable(),
  heroImageUrl: z.string().optional().nullable(),
});

export const serviceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

export const testimonialSchema = z.object({
  name: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
  date: z.string(),
});
