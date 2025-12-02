import { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const requirements = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  }, [password]);

  const strength = useMemo(() => {
    const fulfilled = Object.values(requirements).filter(Boolean).length;
    if (fulfilled === 0) return { label: '', color: '', width: '0%' };
    if (fulfilled === 1) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (fulfilled === 2) return { label: 'Fair', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
  }, [requirements]);

  if (!password) return null;

  return (
    <div className="space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span className={`font-semibold ${
            strength.label === 'Weak' ? 'text-red-500' :
            strength.label === 'Fair' ? 'text-yellow-500' :
            strength.label === 'Strong' ? 'text-green-500' : ''
          }`}>
            {strength.label}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: strength.width }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        <RequirementItem
          met={requirements.minLength}
          label="At least 8 characters"
        />
        <RequirementItem
          met={requirements.hasNumber}
          label="Contains a number"
        />
        <RequirementItem
          met={requirements.hasSymbol}
          label="Contains a special character"
        />
      </div>
    </div>
  );
};

interface RequirementItemProps {
  met: boolean;
  label: string;
}

const RequirementItem = ({ met, label }: RequirementItemProps) => {
  return (
    <div className={`flex items-center gap-2 text-xs transition-colors ${
      met ? 'text-green-600' : 'text-muted-foreground'
    }`}>
      {met ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}
      <span>{label}</span>
    </div>
  );
};
