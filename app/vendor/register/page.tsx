'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '../../../lib/context/AppContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Card } from '../../../components/ui/Card';
import { VendorDocument } from '../../../lib/types';
import {
  Building2,
  FileCheck2,
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

export default function VendorRegistrationPage() {
  const { registerVendor } = useApp();

  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('Private Limited');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [category, setCategory] = useState('IT Hardware & Systems');

  // Mock document files state
  const [gstCertUploaded, setGstCertUploaded] = useState(true);
  const [panDocUploaded, setPanDocUploaded] = useState(true);
  const [businessRegUploaded, setBusinessRegUploaded] = useState(true);
  const [bankProofUploaded, setBankProofUploaded] = useState(true);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredVendorId, setRegisteredVendorId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const documents: VendorDocument[] = [
      {
        id: `doc-${Date.now()}-1`,
        name: `${companyName || 'Vendor'}_GST_Certificate.pdf`,
        type: 'GST_CERTIFICATE',
        url: '#',
        fileSize: '1.2 MB',
        uploadedAt: new Date().toISOString(),
        verified: false,
      },
      {
        id: `doc-${Date.now()}-2`,
        name: `${companyName || 'Vendor'}_PAN_Card.pdf`,
        type: 'PAN',
        url: '#',
        fileSize: '480 KB',
        uploadedAt: new Date().toISOString(),
        verified: false,
      },
      {
        id: `doc-${Date.now()}-3`,
        name: `${companyName || 'Vendor'}_Incorporation_Certificate.pdf`,
        type: 'BUSINESS_REG',
        url: '#',
        fileSize: '2.4 MB',
        uploadedAt: new Date().toISOString(),
        verified: false,
      },
      {
        id: `doc-${Date.now()}-4`,
        name: `${companyName || 'Vendor'}_Bank_Cancelled_Cheque.pdf`,
        type: 'BANK_PROOF',
        url: '#',
        fileSize: '650 KB',
        uploadedAt: new Date().toISOString(),
        verified: false,
      },
    ];

    setTimeout(() => {
      const newVendor = registerVendor({
        companyName,
        businessType,
        contactPerson,
        email,
        phone,
        address,
        city: city || 'Bengaluru',
        state: state || 'Karnataka',
        pincode: pincode || '560100',
        gstNumber: gstNumber.toUpperCase(),
        panNumber: panNumber.toUpperCase(),
        bankName,
        bankAccount,
        ifscCode: ifscCode.toUpperCase(),
        documents,
        category,
      });

      setRegisteredVendorId(newVendor.id);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 400);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800 mb-2">
            Status: PENDING_VERIFICATION
          </span>

          <h2 className="text-2xl font-black text-slate-900">
            Registration Submitted Successfully!
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Thank you for registering <strong>{companyName}</strong>. Your reference ID is{' '}
            <span className="font-mono font-bold text-slate-900">{registeredVendorId}</span>.
          </p>

          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-left text-xs space-y-2">
            <div className="font-bold text-slate-700">Next Steps in Verification:</div>
            <div className="flex items-start gap-2 text-slate-600">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] mt-0.5">
                1
              </span>
              <span>Procurement team will inspect submitted GST, PAN and bank credentials.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] mt-0.5">
                2
              </span>
              <span>Central Admin provides final onboarding approval to grant Active status.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] mt-0.5">
                3
              </span>
              <span>Once active, you will receive RFQ bid invitations and Purchase Orders.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="md" className="w-full">
                Go to Login
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" size="md" className="w-full">
                Return Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
              S
            </div>
            <span className="font-extrabold text-xl text-white">Sourcelyx</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Vendor Statutory Onboarding
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete the company information and statutory documentation to partner with Sourcelyx
          </p>
        </div>

        {/* Form Card */}
        <Card className="bg-white p-6 sm:p-10 rounded-2xl shadow-2xl border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Business Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building2 className="w-4 h-4 text-indigo-600" />
                1. Company & Entity Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Company / Enterprise Name"
                    required
                    placeholder="e.g. Apex Technologies Pvt Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <Select
                  label="Business Entity Type"
                  required
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  options={[
                    { value: 'Private Limited', label: 'Private Limited (Pvt Ltd)' },
                    { value: 'Public Limited', label: 'Public Limited (Ltd)' },
                    { value: 'LLP', label: 'Limited Liability Partnership (LLP)' },
                    { value: 'Sole Proprietorship', label: 'Sole Proprietorship' },
                    { value: 'Partnership', label: 'Partnership Firm' },
                  ]}
                />
                <Select
                  label="Primary Supply Category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={[
                    { value: 'IT Hardware & Systems', label: 'IT Hardware & Systems' },
                    { value: 'Cloud & SaaS Solutions', label: 'Cloud & SaaS Solutions' },
                    { value: 'Office Automation & Supplies', label: 'Office Automation & Supplies' },
                    { value: 'Networking & Telecommunications', label: 'Networking & Telecommunications' },
                    { value: 'Facilities & Logistics', label: 'Facilities & Logistics' },
                  ]}
                />
              </div>
            </div>

            {/* Section 2: Contact Information */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <Phone className="w-4 h-4 text-indigo-600" />
                2. Contact & Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <Input
                    label="Authorized Contact Person"
                    required
                    placeholder="Full Name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="Official Email Address"
                    type="email"
                    required
                    placeholder="vendor@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="Direct Phone Number"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="City"
                    required
                    placeholder="e.g. Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Registered Office Address"
                    required
                    placeholder="Building, Street, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="State"
                    required
                    placeholder="e.g. Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="PIN Code"
                    required
                    placeholder="e.g. 560100"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Tax & Banking */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                3. Tax & Bank Credentials (Statutory)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <Input
                    label="GST Number (15 Digits)"
                    required
                    placeholder="29ABCDE1234F1Z5"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    helperText="State code + PAN + entity digits"
                  />
                </div>
                <div>
                  <Input
                    label="PAN / Tax ID (10 Digits)"
                    required
                    placeholder="ABCDE1234F"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="Bank Name"
                    required
                    placeholder="e.g. HDFC Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    label="Bank Account Number"
                    required
                    placeholder="50200012345678"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Bank IFSC Code"
                    required
                    placeholder="HDFC0000123"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Document Upload UI */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                4. Mandatory Statutory Documents Upload
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Upload clear PDF/image scans for verification by procurement compliance officers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* GST Certificate */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">GST Registration Certificate</div>
                    <div className="text-[10px] text-slate-500">PDF, max 5MB</div>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 shadow-xs">
                    <span>{gstCertUploaded ? '✓ Attached' : 'Attach'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={() => setGstCertUploaded(true)}
                    />
                  </label>
                </div>

                {/* PAN Card */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Company PAN Card</div>
                    <div className="text-[10px] text-slate-500">PDF or JPG, max 5MB</div>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 shadow-xs">
                    <span>{panDocUploaded ? '✓ Attached' : 'Attach'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={() => setPanDocUploaded(true)}
                    />
                  </label>
                </div>

                {/* Business Registration */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Certificate of Incorporation / Deed</div>
                    <div className="text-[10px] text-slate-500">Govt. issued MCA document</div>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 shadow-xs">
                    <span>{businessRegUploaded ? '✓ Attached' : 'Attach'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={() => setBusinessRegUploaded(true)}
                    />
                  </label>
                </div>

                {/* Bank Proof */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Cancelled Cheque / Bank Mandate</div>
                    <div className="text-[10px] text-slate-500">With visible IFSC and Account Number</div>
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 shadow-xs">
                    <span>{bankProofUploaded ? '✓ Attached' : 'Attach'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={() => setBankProofUploaded(true)}
                    />
                  </label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Submit Vendor Registration
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
