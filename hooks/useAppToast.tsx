// File: hooks/useAppToast.tsx (tên mới)

import { Box, Text, useToast } from '@gluestack-ui/themed';
import React from 'react';

export const useAppToast = () => {
  const toast = useToast();

  const showToast = ({ title, description }: { title: string, description?: string }) => {
    toast.show({
      placement: "top",
      render: ({ id }) => {
        return (
          <Box 
            bg="$emerald500" 
            px="$4" 
            py="$3" 
            rounded="$sm" 
            mb="$4"
          >
            <Text color="white" fontWeight="$medium">{title}</Text>
            {description && <Text color="$trueGray200" size="sm">{description}</Text>}
          </Box>
        );
      },
    });
  };

  return { showToast };
};