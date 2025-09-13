import { useState, useRef } from "react";
import { CalendarIcon, Upload, X, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = 'http://localhost:3001';

interface UploadedFile {
  file: File;
  preview?: string;
}

export function FaultReportForm() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [reportData, setReportData] = useState({
    title: "",
    assetId: "",
    subsystem: "",
    location: "",
    category: "",
    severity: "",
    description: "",
    observedCause: "",
    diagnosticSteps: false,
    rootCauseKnown: false,
    rootCauseDetails: "",
    workaround: "",
    temporaryFix: false,
    temporaryFixDetails: "",
    passengerSafety: false,
    staffSafety: false,
    sparePartsRequired: false,
    sparePartsList: "",
    estimatedRepairTime: "",
    reporter: "",
    supervisorNotified: false,
    escalationNeeded: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Handle file upload
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const validFiles: UploadedFile[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`File "${file.name}" has unsupported type. Only JPG, PNG, PDF, TXT, DOC, and DOCX files are allowed.`);
        return;
      }
      
      if (file.size > maxSize) {
        errors.push(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }
      
      const uploadedFile: UploadedFile = { file };
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        uploadedFile.preview = URL.createObjectURL(file);
      }
      
      validFiles.push(uploadedFile);
    });

    if (errors.length > 0) {
      toast({
        title: "File Upload Error",
        description: errors.join(' '),
        variant: "destructive",
      });
    }

    // Check total file limit (5 files max)
    const totalFiles = uploadedFiles.length + validFiles.length;
    if (totalFiles > 5) {
      toast({
        title: "Too Many Files",
        description: "Maximum 5 files allowed per report.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    // Clear the input
    if (event.target) {
      event.target.value = '';
    }
  };

  // Remove file from upload list
  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      // Revoke object URL for images
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Validate form data
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!reportData.title.trim()) errors.push('Title is required');
    if (!reportData.description.trim()) errors.push('Description is required');
    if (!reportData.reporter.trim()) errors.push('Reporter name is required');
    if (!reportData.severity) errors.push('Severity is required');
    if (!reportData.assetId.trim()) errors.push('Asset ID is required');
    
    return errors;
  };

  // Submit form
  const handleSubmit = async (isDraftSubmission = false) => {
    setIsSubmitting(true);
    setIsDraft(isDraftSubmission);
    
    try {
      // Validate form
      const validationErrors = validateForm();
      if (validationErrors.length > 0 && !isDraftSubmission) {
        toast({
          title: "Validation Error",
          description: validationErrors.join(', '),
          variant: "destructive",
        });
        return;
      }

      // Prepare form data
      const formData = new FormData();
      
      // Add all form fields
      Object.entries(reportData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          formData.append(key, typeof value === 'boolean' ? value.toString() : value);
        }
      });
      
      // Add current date if not provided
      if (!reportData.title && !isDraftSubmission) {
        formData.set('title', `Fault Report - ${reportData.assetId} - ${new Date().toLocaleDateString()}`);
      }
      
      formData.set('date', new Date().toISOString());
      
      // Add files
      uploadedFiles.forEach(({ file }) => {
        formData.append('files', file);
      });
      
      // Submit to backend
      const response = await fetch(`${API_BASE_URL}/api/faults`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit fault report');
      }
      
      // Success
      toast({
        title: isDraftSubmission ? "Draft Saved" : "Report Submitted",
        description: isDraftSubmission ? "Your fault report draft has been saved." : "Your fault report has been submitted successfully.",
      });
      
      // Reset form
      setReportData({
        title: "",
        assetId: "",
        subsystem: "",
        location: "",
        category: "",
        severity: "",
        description: "",
        observedCause: "",
        diagnosticSteps: false,
        rootCauseKnown: false,
        rootCauseDetails: "",
        workaround: "",
        temporaryFix: false,
        temporaryFixDetails: "",
        passengerSafety: false,
        staffSafety: false,
        sparePartsRequired: false,
        sparePartsList: "",
        estimatedRepairTime: "",
        reporter: "",
        supervisorNotified: false,
        escalationNeeded: false,
      });
      
      // Clean up file previews and reset files
      uploadedFiles.forEach(({ preview }) => {
        if (preview) URL.revokeObjectURL(preview);
      });
      setUploadedFiles([]);
      
    } catch (error) {
      console.error('Error submitting fault report:', error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit fault report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsDraft(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Asset/Unit Identification</CardTitle>
          <CardDescription>
            Identify the asset and component experiencing issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Fault Report Title</Label>
            <Input
              id="title"
              placeholder="Brief title for the fault report"
              value={reportData.title}
              onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetId">Asset ID / Trainset Number *</Label>
              <Input
                id="assetId"
                placeholder="e.g., Unit 407"
                value={reportData.assetId}
                onChange={(e) => setReportData({ ...reportData, assetId: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subsystem">Subsystem / Component</Label>
              <Select onValueChange={(value) => setReportData({ ...reportData, subsystem: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subsystem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traction">Traction System</SelectItem>
                  <SelectItem value="braking">Braking System</SelectItem>
                  <SelectItem value="hvac">HVAC System</SelectItem>
                  <SelectItem value="doors">Door System</SelectItem>
                  <SelectItem value="signaling">Signaling System</SelectItem>
                  <SelectItem value="lighting">Lighting System</SelectItem>
                  <SelectItem value="communication">Communication System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select onValueChange={(value) => setReportData({ ...reportData, location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="depot">Depot</SelectItem>
                  <SelectItem value="station-1">Aluva Station</SelectItem>
                  <SelectItem value="station-2">Kaloor Station</SelectItem>
                  <SelectItem value="station-3">Ernakulam South</SelectItem>
                  <SelectItem value="track-section-1">Track Section A-B</SelectItem>
                  <SelectItem value="track-section-2">Track Section B-C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fault Details</CardTitle>
          <CardDescription>
            Describe the fault and its severity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Fault Category</Label>
              <Select onValueChange={(value) => setReportData({ ...reportData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="mechanical">Mechanical</SelectItem>
                  <SelectItem value="signaling">Signaling</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <RadioGroup 
                value={reportData.severity}
                onValueChange={(value) => setReportData({ ...reportData, severity: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minor" id="minor" />
                  <Label htmlFor="minor">Minor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="major" id="major" />
                  <Label htmlFor="major">Major</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="critical" id="critical" />
                  <Label htmlFor="critical">Critical</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Fault Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the fault in detail..."
              value={reportData.description}
              onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedDowntime">Expected Downtime</Label>
            <Input
              id="expectedDowntime"
              placeholder="e.g., until 16:00"
              type="datetime-local"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cause & Diagnosis</CardTitle>
          <CardDescription>
            Analysis and diagnostic information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observedCause">Observed Cause</Label>
            <Textarea
              id="observedCause"
              placeholder="e.g., Traction converter overheating"
              value={reportData.observedCause}
              onChange={(e) => setReportData({ ...reportData, observedCause: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="diagnosticSteps"
              checked={reportData.diagnosticSteps}
              onCheckedChange={(checked) => 
                setReportData({ ...reportData, diagnosticSteps: checked as boolean })
              }
            />
            <Label htmlFor="diagnosticSteps">Diagnostic steps performed</Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rootCauseKnown"
                checked={reportData.rootCauseKnown}
                onCheckedChange={(checked) => 
                  setReportData({ ...reportData, rootCauseKnown: checked as boolean })
                }
              />
              <Label htmlFor="rootCauseKnown">Root cause known</Label>
            </div>
            {reportData.rootCauseKnown && (
              <Textarea
                placeholder="Describe the root cause..."
                value={reportData.rootCauseDetails}
                onChange={(e) => setReportData({ ...reportData, rootCauseDetails: e.target.value })}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Immediate Actions Taken</CardTitle>
          <CardDescription>
            Temporary measures and safety considerations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workaround">Workaround Applied</Label>
            <Textarea
              id="workaround"
              placeholder="e.g., Reserve 2 backup units for service"
              value={reportData.workaround}
              onChange={(e) => setReportData({ ...reportData, workaround: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="temporaryFix"
                checked={reportData.temporaryFix}
                onCheckedChange={(checked) => 
                  setReportData({ ...reportData, temporaryFix: checked as boolean })
                }
              />
              <Label htmlFor="temporaryFix">Temporary fix attempted</Label>
            </div>
            {reportData.temporaryFix && (
              <Textarea
                placeholder="Details of temporary fix..."
                value={reportData.temporaryFixDetails}
                onChange={(e) => setReportData({ ...reportData, temporaryFixDetails: e.target.value })}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label>Safety Implications</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="passengerSafety"
                  checked={reportData.passengerSafety}
                  onCheckedChange={(checked) => 
                    setReportData({ ...reportData, passengerSafety: checked as boolean })
                  }
                />
                <Label htmlFor="passengerSafety">Passenger safety impacted</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="staffSafety"
                  checked={reportData.staffSafety}
                  onCheckedChange={(checked) => 
                    setReportData({ ...reportData, staffSafety: checked as boolean })
                  }
                />
                <Label htmlFor="staffSafety">Staff safety impacted</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parts & Resources</CardTitle>
          <CardDescription>
            Required materials and resources for repair
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sparePartsRequired"
                checked={reportData.sparePartsRequired}
                onCheckedChange={(checked) => 
                  setReportData({ ...reportData, sparePartsRequired: checked as boolean })
                }
              />
              <Label htmlFor="sparePartsRequired">Spare parts required</Label>
            </div>
            {reportData.sparePartsRequired && (
              <Textarea
                placeholder="List item codes and descriptions..."
                value={reportData.sparePartsList}
                onChange={(e) => setReportData({ ...reportData, sparePartsList: e.target.value })}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedRepairTime">Estimated Repair Time</Label>
            <Input
              id="estimatedRepairTime"
              placeholder="e.g., 4 hours or requires external vendor"
              value={reportData.estimatedRepairTime}
              onChange={(e) => setReportData({ ...reportData, estimatedRepairTime: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reporting / Escalation</CardTitle>
          <CardDescription>
            Reporter information and escalation status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reporter">Reporter Name / ID *</Label>
            <Input
              id="reporter"
              placeholder="Enter your name and employee ID"
              value={reportData.reporter}
              onChange={(e) => setReportData({ ...reportData, reporter: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="supervisorNotified"
              checked={reportData.supervisorNotified}
              onCheckedChange={(checked) => 
                setReportData({ ...reportData, supervisorNotified: checked as boolean })
              }
            />
            <Label htmlFor="supervisorNotified">Supervisor notified</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="escalationNeeded"
              checked={reportData.escalationNeeded}
              onCheckedChange={(checked) => 
                setReportData({ ...reportData, escalationNeeded: checked as boolean })
              }
            />
            <Label htmlFor="escalationNeeded">Escalation needed</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
          <CardDescription>
            Upload photos, videos, or documents related to the fault
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Upload photos, videos, or documents (JPG, PNG, PDF, TXT, DOC, DOCX)
            </p>
            <p className="text-xs text-muted-foreground">
              Max 5 files, 10MB each
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.txt,.doc,.docx"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          
          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <Label>Selected Files ({uploadedFiles.length}/5)</Label>
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">{uploadedFile.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          variant="outline"
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting}
          type="button"
        >
          {isDraft && isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Saving Draft...</span>
            </div>
          ) : (
            'Save as Draft'
          )}
        </Button>
        <Button 
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
          type="button"
        >
          {!isDraft && isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Submit Report</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}