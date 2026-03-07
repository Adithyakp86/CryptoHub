import { describe, it, expect, vi, beforeEach } from 'vitest';
import toast from 'react-hot-toast';
import { notifySuccess, notifyError, notifyInfo } from '../notify';

vi.mock('react-hot-toast');

describe('notify utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('notifySuccess', () => {
    it('should call toast.success with message', () => {
      const message = 'Operation successful';
      notifySuccess(message);

      expect(toast.success).toHaveBeenCalledWith(message);
      expect(toast.success).toHaveBeenCalledTimes(1);
    });

    it('should handle empty strings', () => {
      notifySuccess('');

      expect(toast.success).toHaveBeenCalledWith('');
    });

    it('should handle special characters', () => {
      const message = 'Success! ✓ @#$%';
      notifySuccess(message);

      expect(toast.success).toHaveBeenCalledWith(message);
    });

    it('should handle long messages', () => {
      const longMessage = 'a'.repeat(1000);
      notifySuccess(longMessage);

      expect(toast.success).toHaveBeenCalledWith(longMessage);
    });

    it('should handle message with newlines', () => {
      const message = 'Line 1\nLine 2\nLine 3';
      notifySuccess(message);

      expect(toast.success).toHaveBeenCalledWith(message);
    });
  });

  describe('notifyError', () => {
    it('should call toast.error with message', () => {
      const message = 'An error occurred';
      notifyError(message);

      expect(toast.error).toHaveBeenCalledWith(message);
      expect(toast.error).toHaveBeenCalledTimes(1);
    });

    it('should handle error messages with codes', () => {
      const message = 'Error 404: Not Found';
      notifyError(message);

      expect(toast.error).toHaveBeenCalledWith(message);
    });

    it('should handle network error messages', () => {
      const message = 'Network request failed';
      notifyError(message);

      expect(toast.error).toHaveBeenCalledWith(message);
    });

    it('should handle validation error messages', () => {
      const message = 'Invalid input: Please check your data';
      notifyError(message);

      expect(toast.error).toHaveBeenCalledWith(message);
    });

    it('should handle permission error messages', () => {
      const message = 'Permission denied: You do not have access';
      notifyError(message);

      expect(toast.error).toHaveBeenCalledWith(message);
    });
  });

  describe('notifyInfo', () => {
    it('should call toast with message', () => {
      const message = 'Please note this information';
      notifyInfo(message);

      expect(toast).toHaveBeenCalledWith(message);
      expect(toast).toHaveBeenCalledTimes(1);
    });

    it('should handle informational messages', () => {
      const message = 'Data is being loaded...';
      notifyInfo(message);

      expect(toast).toHaveBeenCalledWith(message);
    });

    it('should handle update notifications', () => {
      const message = 'New version available';
      notifyInfo(message);

      expect(toast).toHaveBeenCalledWith(message);
    });

    it('should handle reminder messages', () => {
      const message = 'Remember to save your changes';
      notifyInfo(message);

      expect(toast).toHaveBeenCalledWith(message);
    });

    it('should handle empty info messages', () => {
      notifyInfo('');

      expect(toast).toHaveBeenCalledWith('');
    });
  });

  describe('Multiple notifications', () => {
    it('should allow multiple success notifications', () => {
      notifySuccess('Success 1');
      notifySuccess('Success 2');
      notifySuccess('Success 3');

      expect(toast.success).toHaveBeenCalledTimes(3);
    });

    it('should allow multiple error notifications', () => {
      notifyError('Error 1');
      notifyError('Error 2');

      expect(toast.error).toHaveBeenCalledTimes(2);
    });

    it('should allow mixing notification types', () => {
      notifySuccess('Done');
      notifyError('Failed');
      notifyInfo('Info');

      expect(toast.success).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledTimes(1);
      expect(toast).toHaveBeenCalledTimes(3); // One for each call
    });

    it('should maintain call order', () => {
      const calls = [];
      vi.mocked(toast.success).mockImplementation(() => calls.push('success'));
      vi.mocked(toast.error).mockImplementation(() => calls.push('error'));
      vi.mocked(toast).mockImplementation(() => calls.push('info'));

      notifySuccess('msg');
      notifyError('msg');
      notifyInfo('msg');

      expect(calls).toEqual(['success', 'error', 'info']);
    });
  });

  describe('Message content variations', () => {
    it('should handle messages with HTML entities', () => {
      const message = 'User&apos;s data &copy; 2024';
      notifySuccess(message);

      expect(toast.success).toHaveBeenCalledWith(message);
    });

    it('should handle messages with URLs', () => {
      const message = 'Check https://example.com for details';
      notifyInfo(message);

      expect(toast).toHaveBeenCalledWith(message);
    });

    it('should handle messages with timestamps', () => {
      const message = `Operation completed at ${new Date().toISOString()}`;
      notifySuccess(message);

      expect(toast.success).toHaveBeenCalledWith(message);
    });

    it('should handle messages with numeric values', () => {
      const message = 'You earned 1000 points in portfolio gains';
      notifySuccess(message);

      expect(toast.success).toHaveBeenCalledWith(message);
    });

    it('should handle messages with emojis', () => {
      const message = '✅ Transaction successful ✨';
      notifySuccess(message);

      expect(toast.success).toHaveBeenCalledWith(message);
    });
  });

  describe('Edge cases', () => {
    it('should be called immediately', () => {
      const spy = vi.spyOn(toast, 'success');
      notifySuccess('test');

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not throw on repeated rapid calls', () => {
      expect(() => {
        for (let i = 0; i < 10; i++) {
          notifySuccess(`message ${i}`);
        }
      }).not.toThrow();

      expect(toast.success).toHaveBeenCalledTimes(10);
    });

    it('should handle case insensitivity in function names', () => {
      // The functions should work regardless of how they're called
      const successNotification = notifySuccess;
      const errorNotification = notifyError;
      const infoNotification = notifyInfo;

      successNotification('success');
      errorNotification('error');
      infoNotification('info');

      expect(toast.success).toHaveBeenCalledWith('success');
      expect(toast.error).toHaveBeenCalledWith('error');
    });
  });

  describe('Real-world scenarios', () => {
    it('should notify portfolio update', () => {
      notifySuccess('Portfolio updated: +$1,234.56');
      expect(toast.success).toHaveBeenCalledWith('Portfolio updated: +$1,234.56');
    });

    it('should notify transaction submission', () => {
      notifyInfo('Transaction submitted to blockchain...');
      expect(toast).toHaveBeenCalledWith('Transaction submitted to blockchain...');
    });

    it('should notify failed login', () => {
      notifyError('Invalid email or password');
      expect(toast.error).toHaveBeenCalledWith('Invalid email or password');
    });

    it('should notify successful logout', () => {
      notifySuccess('You have been logged out');
      expect(toast.success).toHaveBeenCalledWith('You have been logged out');
    });

    it('should notify price alert', () => {
      notifyInfo('Bitcoin price alert: $70,000');
      expect(toast).toHaveBeenCalledWith('Bitcoin price alert: $70,000');
    });
  });
});
