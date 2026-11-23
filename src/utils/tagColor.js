const TAG_COLORS = ['blue', 'green', 'amber', 'purple', 'red', 'gray']

// Warna badge yang stabil untuk setiap tag.
export const tagColor = (tag) => TAG_COLORS[[...tag].reduce((s, c) => s + c.charCodeAt(0), 0) % TAG_COLORS.length]
