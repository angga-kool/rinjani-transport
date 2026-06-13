"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { BadgeCheck } from "lucide-react";

export default function CompanyProfilePage() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Company Profile</h2>
      <p className="mt-1 text-sm text-gray-500">Update your company information</p>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            G
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">Gili Speed Boat</h3>
              <BadgeCheck className="h-5 w-5 text-primary" />
            </div>
            <Badge variant="verified">Verified Operator</Badge>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Company Name" defaultValue="Gili Speed Boat" />
            <Input label="Contact Email" type="email" defaultValue="info@gilispeedboat.com" />
            <Input label="Contact Phone" type="tel" defaultValue="+62 812 3456 7890" />
            <Input label="Address" defaultValue="Teluk Nare, North Lombok" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              defaultValue="Fast and reliable speed boat transfers between Lombok and Gili Islands. Operating since 2015 with modern speed boats."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/8"
            />
          </div>

          <Button type="submit" size="lg">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
