import Badge from '../Badge/Badge'
import styles from './TodoItem.module.css'

// Gaya berubah dinamis menurut props `todo.completed`.
export default function TodoItem({ todo, onToggle, showUser = false }) {
  return (
    <li className={`${styles.item} ${todo.completed ? styles.done : ''}`}>
      <label className={styles.label}>
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo)} />
        <span className={styles.text}>{todo.todo}</span>
      </label>
      {showUser && <Badge color="gray">Siswa #{todo.userId}</Badge>}
      <Badge color={todo.completed ? 'green' : 'amber'}>{todo.completed ? 'Selesai' : 'Belum'}</Badge>
    </li>
  )
}
