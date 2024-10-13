import Dexie, { Table } from 'dexie';

export interface Intervention {
  id?: number;
  date: string;
  intervention: string;
  nombreBons: number;
  cdh: number;
  gdh: number;
  totalHT: number;
  sansVouchers: number;
  natureIntervention: string;
  personneEnCharge: string;
  dateEmail: string;
  createdBy: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
}

export interface User {
  id?: number;
  username: string;
  password: string;
  role: 'input' | 'editor' | 'admin';
}

export class InterventionDatabase extends Dexie {
  interventions!: Table<Intervention>;
  users!: Table<User>;

  constructor() {
    super('InterventionDatabase');
    this.version(2).stores({
      interventions: '++id, date, intervention, nombreBons, cdh, gdh, totalHT, sansVouchers, natureIntervention, personneEnCharge, dateEmail, createdBy, lastModifiedBy, lastModifiedAt',
      users: '++id, username, role'
    });
  }
}

export const db = new InterventionDatabase();

// Initialize default users
db.on('ready', async () => {
  const userCount = await db.users.count();
  if (userCount === 0) {
    await db.users.bulkAdd([
      { username: 'input_user', password: 'input123', role: 'input' },
      { username: 'editor_user', password: 'editor123', role: 'editor' },
      { username: 'admin_user', password: 'admin123', role: 'admin' }
    ]);
  }
});