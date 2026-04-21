export type ScamFlag = {
  id: string
  label: string
  severity: 'high' | 'medium' | 'low'
}

type Rule = ScamFlag & { patterns: RegExp[] }

const RULES: Rule[] = [
  {
    id: 'check_payment',
    label: 'Mentions check or cashier’s check',
    severity: 'high',
    patterns: [
      /\bcashier'?s?\s+check\b/i,
      /\bcertified\s+check\b/i,
      /\bmoney\s+order\b/i,
      /\bpersonal\s+check\b/i,
      /\bpay\s+by\s+check\b/i,
      /\bsend(ing)?\s+(you\s+)?a\s+check\b/i,
    ],
  },
  {
    id: 'overpayment',
    label: 'Overpayment / excess funds pattern',
    severity: 'high',
    patterns: [
      /\bover\s*payment\b/i,
      /\bexcess\s+(funds|amount|money|payment)\b/i,
      /\brefund\s+the\s+(balance|difference|extra)\b/i,
      /\bsend\s+(you\s+)?(extra|additional|more\s+than)\b/i,
      /\bextra\s+(amount|money|funds|cash)\b/i,
    ],
  },
  {
    id: 'third_party_shipper',
    label: 'Wants to use their own shipper or pickup agent',
    severity: 'high',
    patterns: [
      /\bshipping\s+(agent|company|broker|handler)\b/i,
      /\bmy\s+(own\s+)?(shipper|mover|carrier|freight|courier)\b/i,
      /\bprivate\s+(carrier|shipper|courier)\b/i,
      /\bpickup\s+(agent|guy|person|handler)\b/i,
      /\bhire(d)?\s+(a\s+)?mover\b/i,
    ],
  },
  {
    id: 'gift_for_relative',
    label: 'Classic "surprise gift for [relative]" opener',
    severity: 'medium',
    patterns: [
      /surprise\s+(gift|present)/i,
      /\b(anniversary|birthday)\b.{0,40}\b(coming\s+up|next\s+week|soon)\b/i,
      /\bgift\s+for\s+my\s+(wife|husband|niece|nephew|daughter|son|mother|father|grandma|grandpa)\b/i,
    ],
  },
  {
    id: 'identity_mask',
    label: 'Deaf/hearing-impaired identity (common scam cover)',
    severity: 'medium',
    patterns: [
      /\b(deaf|hearing[\s-]?impaired|speech[\s-]?impaired|mute)\b/i,
      /\bcan(?:no|')t\s+(speak|hear|call)\b/i,
    ],
  },
  {
    id: 'offsite_contact',
    label: 'Asks to move conversation off-site',
    severity: 'medium',
    patterns: [
      /\btext\s+me\s+(at|on)\b/i,
      /\bwhatsapp\b/i,
      /\btelegram\b/i,
      /\bmy\s+(phone|cell|mobile)\s*(number|#)?\s*is\b/i,
      /\+?\d[\d\s().-]{7,}\d/,
    ],
  },
  {
    id: 'unavailable_buyer',
    label: 'Buyer "unavailable to view" (common scam cover)',
    severity: 'medium',
    patterns: [
      /\b(currently|presently)\s+(on\s+a\s+)?business\s+trip\b/i,
      /\bout\s+of\s+(the\s+)?(country|town|state)\b/i,
      /\bunable\s+to\s+(view|see|visit|come)\b/i,
      /\btraveling\s+abroad\b/i,
    ],
  },
  {
    id: 'extreme_urgency',
    label: 'Extreme urgency',
    severity: 'low',
    patterns: [
      /\basap\b/i,
      /\bvery\s+urgent\b/i,
      /\brush\s+(order|job|delivery)\b/i,
      /\bneed\s+(it|this)\s+(today|tomorrow|this\s+week)\b/i,
    ],
  },
]

export function scoreCommission(text: string): {
  flags: ScamFlag[]
  score: number
} {
  const flags: ScamFlag[] = []
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(text))) {
      flags.push({ id: rule.id, label: rule.label, severity: rule.severity })
    }
  }
  const score = flags.reduce(
    (acc, f) => acc + (f.severity === 'high' ? 10 : f.severity === 'medium' ? 4 : 1),
    0
  )
  return { flags, score }
}
