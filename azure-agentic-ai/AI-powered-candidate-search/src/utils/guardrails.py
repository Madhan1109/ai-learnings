"""
NVIDIA NeMo Guardrails integration for input/output filtering
"""

from typing import Any, Dict, Optional
from src.config import settings, yaml_config
import os


class GuardrailsManager:
    """Manager for NVIDIA NeMo Guardrails"""
    
    def __init__(self):
        self.enabled = yaml_config.get("guardrails", {}).get("enabled", True)
        self.config_path = settings.nemo_guardrails_config_path
        self._guardrails_instance = None
        
        if self.enabled:
            self._initialize_guardrails()
    
    def _initialize_guardrails(self):
        """Initialize NeMo Guardrails"""
        try:
            # NeMo Guardrails initialization
            # Note: This is a simplified implementation
            # Full integration would require proper NeMo Guardrails setup
            from nemoguardrails import LLMRails, RailsConfig
            
            if os.path.exists(self.config_path):
                config = RailsConfig.from_path(self.config_path)
                self._guardrails_instance = LLMRails(config)
            else:
                # Use default guardrails configuration
                self._guardrails_instance = self._create_default_guardrails()
                
        except ImportError:
            # Fallback to basic filtering if NeMo Guardrails is not available
            self._guardrails_instance = None
            # Silently use basic filtering
        except Exception as e:
            # Silently fallback to basic filtering
            self._guardrails_instance = None
    
    def _create_default_guardrails(self):
        """Create default guardrails configuration"""
        # Basic implementation - in production, use proper NeMo Guardrails config
        return None
    
    def filter_input(self, text: str) -> tuple[str, bool]:
        """
        Filter input text for sensitive information
        Returns: (filtered_text, is_blocked)
        """
        if not self.enabled:
            return text, False
        
        # Basic sensitive information patterns
        sensitive_patterns = [
            r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
            r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',  # Credit card
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # Email (optional)
        ]
        
        import re
        for pattern in sensitive_patterns:
            if re.search(pattern, text):
                return text, True  # Block if sensitive info found
        
        # Use NeMo Guardrails if available
        if self._guardrails_instance:
            try:
                # This would use NeMo Guardrails API
                # filtered_text = self._guardrails_instance.filter_input(text)
                # For now, return as-is
                return text, False
            except Exception:
                pass
        
        return text, False
    
    def filter_output(self, text: str) -> tuple[str, bool]:
        """
        Filter output text for sensitive information
        Returns: (filtered_text, is_blocked)
        """
        if not self.enabled:
            return text, False
        
        # Basic sensitive information patterns
        sensitive_patterns = [
            r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
            r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',  # Credit card
        ]
        
        import re
        filtered_text = text
        
        for pattern in sensitive_patterns:
            filtered_text = re.sub(pattern, "[REDACTED]", filtered_text)
        
        # Use NeMo Guardrails if available
        if self._guardrails_instance:
            try:
                # This would use NeMo Guardrails API
                # filtered_text = self._guardrails_instance.filter_output(text)
                pass
            except Exception:
                pass
        
        return filtered_text, False


# Global guardrails manager instance
_guardrails_manager = None


def get_guardrails_manager() -> GuardrailsManager:
    """Get the global guardrails manager instance"""
    global _guardrails_manager
    if _guardrails_manager is None:
        _guardrails_manager = GuardrailsManager()
    return _guardrails_manager


def apply_guardrails(text: str, is_input: bool = True) -> tuple[str, bool]:
    """
    Apply guardrails to text
    Args:
        text: Text to filter
        is_input: True if this is input text, False if output
    Returns:
        (filtered_text, is_blocked)
    """
    manager = get_guardrails_manager()
    if is_input:
        return manager.filter_input(text)
    else:
        return manager.filter_output(text)

