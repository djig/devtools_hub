import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { CopyButton } from '../../../components/shared/CopyButton';
import useAppStore from '../../../store/useAppStore';
import { Shuffle, User, Mail, MapPin, CreditCard, Hash } from 'lucide-react';

interface RandomData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  company: string;
  jobTitle: string;
  creditCard: string;
  ssn: string;
  uuid: string;
  ipAddress: string;
  username: string;
  password: string;
  birthdate: string;
}

export default function RandomDataGenerator() {
  const { addRecentTool } = useAppStore();
  const [data, setData] = useState<RandomData | null>(null);
  const [count, setCount] = useState(1);
  const [batchData, setBatchData] = useState<RandomData[]>([]);

  useEffect(() => {
    addRecentTool('random-data-generator');
  }, [addRecentTool]);

  const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
    'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young'
  ];

  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
    'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
    'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle',
    'Denver', 'Boston', 'Portland', 'Nashville', 'Miami', 'Atlanta'
  ];

  const streets = [
    'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Park Pl', 'Washington Blvd',
    'Lake View Dr', 'Hill Rd', 'Elm St', 'Pine Ave', 'River Rd', 'Sunset Blvd',
    'Broadway', 'First Ave', 'Second St', 'Madison Ave', 'Market St', 'Church St'
  ];

  const companies = [
    'Tech Solutions Inc', 'Global Industries', 'Digital Innovations', 'Metro Systems',
    'Prime Enterprises', 'Apex Corporation', 'Vista Technologies', 'Summit Group',
    'Horizon LLC', 'Quantum Labs', 'Nexus Partners', 'Fusion Dynamics'
  ];

  const jobTitles = [
    'Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer',
    'Marketing Manager', 'Sales Representative', 'HR Specialist', 'Financial Analyst',
    'Operations Manager', 'Business Consultant', 'Project Manager', 'Account Executive'
  ];

  const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomItem = <T,>(arr: T[]) => arr[random(0, arr.length - 1)];

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateCreditCard = () => {
    const digits = Array.from({ length: 16 }, () => random(0, 9));
    return digits.join('').match(/.{1,4}/g)?.join(' ') || '';
  };

  const generateSSN = () => {
    return `${random(100, 999)}-${random(10, 99)}-${random(1000, 9999)}`;
  };

  const generateIP = () => {
    return `${random(1, 255)}.${random(0, 255)}.${random(0, 255)}.${random(0, 255)}`;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    return Array.from({ length: 12 }, () => chars[random(0, chars.length - 1)]).join('');
  };

  const generateBirthdate = () => {
    const year = random(1950, 2005);
    const month = random(1, 12);
    const day = random(1, 28);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const generateRandomData = (): RandomData => {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const name = `${firstName} ${lastName}`;
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${random(1, 999)}`;
    const email = `${username}@example.com`;

    return {
      name,
      email,
      phone: `+1 (${random(200, 999)}) ${random(100, 999)}-${random(1000, 9999)}`,
      address: `${random(100, 9999)} ${randomItem(streets)}`,
      city: randomItem(cities),
      country: 'United States',
      zipCode: String(random(10000, 99999)),
      company: randomItem(companies),
      jobTitle: randomItem(jobTitles),
      creditCard: generateCreditCard(),
      ssn: generateSSN(),
      uuid: generateUUID(),
      ipAddress: generateIP(),
      username,
      password: generatePassword(),
      birthdate: generateBirthdate(),
    };
  };

  const handleGenerate = () => {
    setData(generateRandomData());
    setBatchData([]);
  };

  const handleGenerateBatch = () => {
    const batch = Array.from({ length: Math.min(count, 100) }, generateRandomData);
    setBatchData(batch);
    setData(null);
  };

  const exportAsJSON = () => {
    const exportData = batchData.length > 0 ? batchData : data ? [data] : [];
    return JSON.stringify(exportData, null, 2);
  };

  const exportAsCSV = () => {
    const exportData = batchData.length > 0 ? batchData : data ? [data] : [];
    if (exportData.length === 0) return '';

    const headers = Object.keys(exportData[0]).join(',');
    const rows = exportData.map(item =>
      Object.values(item).map(val => `"${val}"`).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />

      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Random Data Generator</h1>
        <p className="text-muted-foreground">
          Generate realistic fake data for testing and development purposes
        </p>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Button onClick={handleGenerate} className="gap-2">
            <Shuffle className="h-4 w-4" />
            Generate Single
          </Button>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="w-20 px-3 py-2 text-sm rounded border border-border bg-background"
            />
            <Button onClick={handleGenerateBatch} variant="outline">
              Generate {count} Records
            </Button>
          </div>
          {(data || batchData.length > 0) && (
            <>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const blob = new Blob([exportAsJSON()], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'random-data.json';
                  a.click();
                }}
              >
                Export JSON
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const blob = new Blob([exportAsCSV()], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'random-data.csv';
                  a.click();
                }}
              >
                Export CSV
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Single Record Display */}
      {data && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Personal Information</h3>
            </div>
            <div className="space-y-3">
              <DataRow label="Full Name" value={data.name} />
              <DataRow label="Username" value={data.username} />
              <DataRow label="Birthdate" value={data.birthdate} />
              <DataRow label="SSN" value={data.ssn} />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Contact Information</h3>
            </div>
            <div className="space-y-3">
              <DataRow label="Email" value={data.email} />
              <DataRow label="Phone" value={data.phone} />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Address</h3>
            </div>
            <div className="space-y-3">
              <DataRow label="Street" value={data.address} />
              <DataRow label="City" value={data.city} />
              <DataRow label="Zip Code" value={data.zipCode} />
              <DataRow label="Country" value={data.country} />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Professional</h3>
            </div>
            <div className="space-y-3">
              <DataRow label="Company" value={data.company} />
              <DataRow label="Job Title" value={data.jobTitle} />
            </div>
          </Card>

          <Card className="p-4 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Technical Data</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <DataRow label="UUID" value={data.uuid} />
              <DataRow label="IP Address" value={data.ipAddress} />
              <DataRow label="Credit Card" value={data.creditCard} />
              <DataRow label="Password" value={data.password} />
            </div>
          </Card>
        </div>
      )}

      {/* Batch Display */}
      {batchData.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Generated {batchData.length} Records</h3>
            <CopyButton text={exportAsJSON()} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 font-medium">Name</th>
                  <th className="text-left py-2 px-2 font-medium">Email</th>
                  <th className="text-left py-2 px-2 font-medium">Phone</th>
                  <th className="text-left py-2 px-2 font-medium">City</th>
                  <th className="text-left py-2 px-2 font-medium">Company</th>
                </tr>
              </thead>
              <tbody>
                {batchData.map((item, idx) => (
                  <tr key={idx} className="border-b border-border last:border-0">
                    <td className="py-2 px-2">{item.name}</td>
                    <td className="py-2 px-2 font-mono text-xs">{item.email}</td>
                    <td className="py-2 px-2 font-mono text-xs">{item.phone}</td>
                    <td className="py-2 px-2">{item.city}</td>
                    <td className="py-2 px-2">{item.company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Info */}
      <Card className="p-4 bg-muted/50">
        <h3 className="font-semibold mb-2">About Random Data</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• All generated data is completely fake and randomly created</p>
          <p>• Data should be used for testing and development purposes only</p>
          <p>• Credit cards, SSNs, and other sensitive data are not real</p>
          <p>• You can generate up to 100 records at once</p>
          <p>• Export data as JSON or CSV for easy integration</p>
        </div>
      </Card>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <div className="flex items-center gap-2">
        <code className="text-sm font-mono">{value}</code>
        <CopyButton text={value} />
      </div>
    </div>
  );
}
