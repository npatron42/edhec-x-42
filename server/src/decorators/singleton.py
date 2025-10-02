#
# Copyright (c) 2025 - 42 x EDHEC
# Authors:
#   - Kilian Ortolani <kilian.ortolani@indigen.com>
#   - Nicolas Patron <nicolas.patron@indigen.com>
#   - Haithem Boukhors <haithem.boukhors@indigen.com>
# NOTICE: All information contained herein is, and remains
# the property of 42 x EDHEC and its suppliers, if any.
# Dissemination of this information or reproduction of this material
# is strictly forbidden unless prior written permission is obtained
# from 42 x EDHEC.
#

from typing import Type, TypeVar, Dict, Any
from functools import wraps

T = TypeVar('T')


def singleton(cls: Type[T]) -> Type[T]:
    """
    A decorator that makes a class a singleton.
    
    This decorator ensures that only one instance of the decorated class
    is created and reused for all subsequent instantiations.
    
    Args:
        cls: The class to be made a singleton
        
    Returns:
        The singleton class
        
    Example:
        @singleton
        class DatabaseConnection:
            def __init__(self):
                self.connection = "established"
                
        # Both instances will be the same object
        db1 = DatabaseConnection()
        db2 = DatabaseConnection()
        assert db1 is db2  # True
    """
    _instances: Dict[Type[T], T] = {}
    
    @wraps(cls)
    def get_instance(*args: Any, **kwargs: Any) -> T:
        if cls not in _instances:
            _instances[cls] = cls(*args, **kwargs)
        return _instances[cls]
    
    return get_instance 
