import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicyPage() {
  const lastUpdated = "June 2, 2024";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader className="border-b bg-gray-50">
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Privacy Policy
              </CardTitle>
              <p className="text-sm text-gray-500">
                Last Updated: {lastUpdated}
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 sm:px-8">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">
                This Privacy Policy explains how ComponentLab ("we", "us", or
                "our") collects, uses, and protects your personal information
                when you use our electronic component borrowing management
                system. Please read this policy carefully to understand our
                practices regarding your personal data.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-600 mb-3">
                We collect the following types of information to provide and
                improve our services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>
                  <span className="font-medium">Personal Information:</span>{" "}
                  Full name, email address, student/staff ID, and academic
                  department or course information.
                </li>
                <li>
                  <span className="font-medium">Account Information:</span>{" "}
                  Login credentials (encrypted), account preferences, and role
                  (student or administrator).
                </li>
                <li>
                  <span className="font-medium">Activity Data:</span> Component
                  borrowing history, permission requests, cart contents, and
                  return records.
                </li>
                <li>
                  <span className="font-medium">Device Information:</span> IP
                  address, browser type, device type, operating system, and
                  access timestamps.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-3">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>To create and manage your user account</li>
                <li>
                  To process component borrowing requests and manage inventory
                </li>
                <li>
                  To track component possession and enforce return policies
                </li>
                <li>
                  To send notifications about due dates, approvals, and system
                  updates
                </li>
                <li>To generate usage statistics and improve our services</li>
                <li>To ensure compliance with institutional policies</li>
                <li>To prevent fraudulent or unauthorized system use</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                3. Cookies and Similar Technologies
              </h2>
              <p className="text-gray-600 mb-3">
                Our system uses cookies and similar technologies to enhance your
                experience and collect information about how you use our
                platform:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>
                  <span className="font-medium">Session Cookies:</span> To
                  maintain your login status and session security.
                </li>
                <li>
                  <span className="font-medium">Preference Cookies:</span> To
                  remember your settings and preferences.
                </li>
                <li>
                  <span className="font-medium">Analytics Cookies:</span> To
                  understand usage patterns and improve our services.
                </li>
              </ul>
              <p className="text-gray-600 mb-6">
                You can modify your browser settings to decline cookies, but
                this may affect certain functionality of our system.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                4. Data Storage and Security
              </h2>
              <p className="text-gray-600 mb-3">
                We are committed to ensuring the security of your personal
                information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>
                  All user data is stored securely in MongoDB databases with
                  encryption at rest.
                </li>
                <li>
                  We implement industry-standard security measures to protect
                  against unauthorized access.
                </li>
                <li>
                  Access to personal data is restricted to authorized personnel
                  only.
                </li>
                <li>
                  Regular security audits and updates are performed to maintain
                  data protection.
                </li>
                <li>Data backups are created regularly and stored securely.</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                5. Data Access and Sharing
              </h2>
              <p className="text-gray-600 mb-3">
                Your information may be accessed by:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>
                  <span className="font-medium">System Administrators:</span>{" "}
                  Can access user profiles, borrowing history, and permission
                  requests to manage the platform.
                </li>
                <li>
                  <span className="font-medium">Lab Supervisors:</span> Can view
                  component requests and borrowing activity related to their
                  managed inventory.
                </li>
                <li>
                  <span className="font-medium">Academic Staff:</span> May have
                  limited access to student borrowing records for educational
                  purposes.
                </li>
              </ul>
              <p className="text-gray-600 mb-6">
                We do not sell, trade, or otherwise transfer your personal
                information to external parties. Data may be shared with third
                parties only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>When required by law or valid legal process</li>
                <li>To protect our rights, property, or safety</li>
                <li>
                  With service providers who help us operate our platform (under
                  confidentiality agreements)
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                6. User Rights
              </h2>
              <p className="text-gray-600 mb-3">
                As a user of our system, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Access your personal information stored in our system</li>
                <li>
                  Request correction of inaccurate or incomplete personal data
                </li>
                <li>
                  View your complete borrowing history and current component
                  possession
                </li>
                <li>
                  Request deletion of your account (subject to institutional
                  policies)
                </li>
                <li>
                  Receive an export of your data in a machine-readable format
                </li>
                <li>Object to certain processing of your personal data</li>
              </ul>
              <p className="text-gray-600 mb-6">
                To exercise these rights, please contact the system
                administrator using the contact information provided below.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-600 mb-6">
                We retain your personal information for as long as necessary to
                fulfill the purposes outlined in this Privacy Policy, unless a
                longer retention period is required by law or institutional
                policy. Borrowing records may be retained for academic
                record-keeping purposes even after you are no longer an active
                user of the system.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                8. Changes to This Policy
              </h2>
              <p className="text-gray-600 mb-6">
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons. The updated policy will be posted on this
                page with a revised "Last Updated" date. We encourage you to
                review this policy periodically.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                9. Contact Information
              </h2>
              <p className="text-gray-600 mb-3">
                If you have questions or concerns about this Privacy Policy or
                our data practices, please contact:
              </p>
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <p className="text-gray-700 font-medium">
                  ComponentLab Privacy Office
                </p>
                <p className="text-gray-600">Email: cnerlab@gmail.com</p>

                <p className="text-gray-600">
                  Address: A220, Department of ECE, BMS Institute of Technology
                  & Management, Yelahanka, Bengaluru - 560119
                </p>
              </div>

              <Separator className="my-8" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
