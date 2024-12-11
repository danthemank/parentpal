// Add to existing validation schemas
export const feedbackSchema = z.object({
  type: z.enum(['suggestion', 'bug', 'complaint', 'praise']),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  category: z.enum(['ui', 'performance', 'feature', 'content', 'other'])
    .optional(),
  rating: z.number().min(1).max(5).optional(),
  attachments: z.array(z.object({
    url: z.string().url(),
    type: z.enum(['image', 'video', 'log'])
  })).optional()
});

export const issueReportSchema = z.object({
  type: z.enum(['bug', 'crash', 'performance', 'security', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  title: z.string().min(5).max(200),
  description: z.string().min(10).max(2000),
  screenName: z.string().optional(),
  deviceInfo: z.object({
    platform: z.string(),
    version: z.string(),
    device: z.string()
  }),
  attachments: z.array(z.object({
    url: z.string().url(),
    type: z.enum(['image', 'video', 'log'])
  })).optional()
});
