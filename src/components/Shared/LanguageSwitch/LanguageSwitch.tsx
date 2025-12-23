/**
 * LanguageSwitch - Language selector component
 * Allows users to switch between Spanish, English, and French
 */
"use client";

import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useState } from 'react';

const languages = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' }
];

export const LanguageSwitch = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    handleClose();
  };

  return (
    <Box>
      <Tooltip title="Change language">
        <IconButton
          onClick={handleClick}
          size="large"
          sx={{
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n.language === language.code}
            sx={{ minWidth: 180 }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <span style={{ fontSize: '1.5rem' }}>{language.flag}</span>
              <span>{language.label}</span>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
