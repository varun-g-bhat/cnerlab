import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsAndConditionsPage() {
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
                Terms and Conditions
              </CardTitle>
              <p className="text-sm text-gray-500">
                Last Updated: {lastUpdated}
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 sm:px-8">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-6">
                Welcome to ComponentLab. These Terms and Conditions govern your
                use of our electronic component borrowing management system. By
                accessing or using our platform, you agree to be bound by these
                Terms. Please read them carefully.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                1. Platform Purpose
              </h2>
              <p className="text-gray-600 mb-6">
                ComponentLab is a system designed to facilitate the borrowing
                and management of electronic components in an educational
                laboratory environment. The platform enables students and staff
                to browse available components, request permissions to borrow
                items, track their borrowing history, and manage returns. It
                also provides administrators with tools to manage inventory,
                approve requests, and monitor component usage.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                2. User Roles and Responsibilities
              </h2>
              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">
                2.1 Student Users
              </h3>
              <p className="text-gray-600 mb-3">
                As a student user, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Maintaining the accuracy of your account information</li>
                <li>
                  Requesting components through the proper cart and permission
                  system
                </li>
                <li>
                  Using borrowed components solely for authorized academic
                  purposes
                </li>
                <li>
                  Returning all components in good condition by the specified
                  due date
                </li>
                <li>Reporting any damage to components immediately</li>
                <li>Keeping track of your borrowing history and due dates</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">
                2.2 Administrative Users
              </h3>
              <p className="text-gray-600 mb-3">
                As an administrative user, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Managing component inventory and availability</li>
                <li>
                  Reviewing and processing permission requests in a timely
                  manner
                </li>
                <li>
                  Monitoring component usage and enforcing return policies
                </li>
                <li>Maintaining accurate records of all transactions</li>
                <li>Ensuring the proper functioning of the borrowing system</li>
                <li>
                  Protecting user data in accordance with our Privacy Policy
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                3. Account Registration and Security
              </h2>
              <p className="text-gray-600 mb-3">
                By creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Provide accurate and complete registration information</li>
                <li>
                  Maintain the confidentiality of your account credentials
                </li>
                <li>
                  Accept responsibility for all activities that occur under your
                  account
                </li>
                <li>
                  Notify administrators immediately of any unauthorized account
                  use
                </li>
                <li>Never share your account credentials with others</li>
              </ul>
              <p className="text-gray-600 mb-6">
                We reserve the right to suspend or terminate accounts that
                violate these terms or engage in suspicious activity.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                4. Borrowing and Return Policies
              </h2>
              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">
                4.1 Requesting Components
              </h3>
              <p className="text-gray-600 mb-6">
                All component requests must be submitted through the platform's
                cart system and require administrative approval before
                components can be issued. Approval is at the discretion of
                administrators and may depend on component availability, user
                history, and academic requirements.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">
                4.2 Borrowing Period
              </h3>
              <p className="text-gray-600 mb-6">
                Components are issued with a specific due date. The standard
                borrowing period is 14 days, but this may vary based on
                component type and demand. Users are responsible for noting the
                due date assigned to each borrowed component and returning items
                on time.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">
                4.3 Renewals
              </h3>
              <p className="text-gray-600 mb-6">
                If you need to keep a component beyond the initial due date, you
                must request a renewal through the platform before the due date.
                Renewals are subject to administrative approval and may be
                denied if other users are waiting for the component or if you
                have overdue items.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">
                4.4 Returns
              </h3>
              <p className="text-gray-600 mb-6">
                All components must be returned in the same condition they were
                issued, allowing for reasonable wear and tear. Returns must be
                processed through the platform and confirmed by an
                administrator. Failure to return components by the due date may
                result in penalties as outlined in section 4.5.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">
                4.5 Late Returns and Penalties
              </h3>
              <p className="text-gray-600 mb-3">
                Failure to return components by the due date may result in:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>Temporary suspension of borrowing privileges</li>
                <li>Restriction on future component requests</li>
                <li>
                  Academic holds or notifications to department supervisors
                </li>
                <li>
                  Responsibility for replacement costs for unreturned items
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                5. Component Care and Liability
              </h2>
              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">
                5.1 User Responsibility
              </h3>
              <p className="text-gray-600 mb-6">
                Users are responsible for the proper care of all borrowed
                components. This includes protecting components from damage,
                theft, or loss while in your possession. Users should follow
                proper handling procedures for sensitive electronic components.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">
                5.2 Damage or Loss
              </h3>
              <p className="text-gray-600 mb-6">
                Users must report any damage to or loss of components
                immediately. You may be held responsible for the repair or
                replacement cost of components damaged due to negligence or
                misuse. The determination of negligence will be made by
                administrative staff based on the circumstances.
              </p>

              <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">
                5.3 Limitation of Liability
              </h3>
              <p className="text-gray-600 mb-6">
                ComponentLab and its administrators are not liable for any
                project failures, data loss, or academic consequences resulting
                from component malfunction, late approvals, or system
                unavailability. Users are advised to plan projects with
                sufficient time buffers and backup options.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                6. Prohibited Activities
              </h2>
              <p className="text-gray-600 mb-3">
                The following activities are strictly prohibited:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-6">
                <li>
                  Requesting components for non-academic or unauthorized
                  purposes
                </li>
                <li>Transferring borrowed components to other individuals</li>
                <li>
                  Attempting to circumvent the permission approval process
                </li>
                <li>
                  Modifying or attempting to reverse-engineer the platform
                </li>
                <li>
                  Creating multiple accounts or providing false information
                </li>
                <li>
                  Using the system to harass, discriminate, or violate the
                  rights of others
                </li>
                <li>
                  Any activity that violates institutional policies or
                  applicable laws
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                7. System Availability and Maintenance
              </h2>
              <p className="text-gray-600 mb-6">
                We strive to maintain system availability, but ComponentLab may
                occasionally be unavailable due to maintenance, updates, or
                technical issues. We are not responsible for any inconvenience
                or consequences resulting from system downtime. Critical
                maintenance will be scheduled and announced in advance whenever
                possible.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                8. Intellectual Property
              </h2>
              <p className="text-gray-600 mb-6">
                All content and software associated with ComponentLab, including
                but not limited to text, graphics, logos, and code, are the
                property of ComponentLab or its licensors and are protected by
                intellectual property laws. Users may not copy, modify,
                distribute, or create derivative works without explicit
                permission.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                9. Termination of Access
              </h2>
              <p className="text-gray-600 mb-6">
                We reserve the right to suspend or terminate your access to
                ComponentLab at any time for violations of these Terms,
                institutional policies, or for any other reason deemed
                appropriate by administrators. Upon termination, you must return
                all borrowed components immediately.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                10. Changes to Terms
              </h2>
              <p className="text-gray-600 mb-6">
                We may modify these Terms at any time by posting the revised
                version on this page with an updated "Last Updated" date. Your
                continued use of the platform after such changes constitutes
                acceptance of the modified Terms.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                11. Governing Law
              </h2>
              <p className="text-gray-600 mb-6">
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction in which the educational
                institution is located, without regard to its conflict of law
                provisions. Any disputes arising under these Terms shall first
                be addressed through the institution's conflict resolution
                procedures before seeking external legal remedies.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                12. Contact Information
              </h2>
              <p className="text-gray-600 mb-3">
                If you have questions about these Terms and Conditions, please
                contact:
              </p>
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <p className="text-gray-700 font-medium">
                  ComponentLab Administration
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
