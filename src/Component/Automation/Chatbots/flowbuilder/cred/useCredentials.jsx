import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as svc from './vault.js'; // Adjusted path
import CredentialVaultModal from '../components/CredentialVault/CredentialVaultModal.jsx'; // Adjusted path

const VaultContext = createContext(null);

export function CredentialVaultProvider({
  children,
  canViewSecrets = true
}) {
  const [credentials, setCredentials] = useState([]);
  const [open, setOpen] = useState(false);

  const refresh = async () => setCredentials(await svc.listCredentials());

  useEffect(() => { void refresh() }, []);

  const create = async (input) => { await svc.createCredential(input); await refresh(); };
  const rotate = async (id, secret) => { await svc.rotateCredential(id, secret); await refresh(); };
  const remove = async (id) => { await svc.deleteCredential(id); await refresh(); };
  const resolve = (id) => svc.resolveSecret(id);

  const value = useMemo(() => ({
    credentials, refresh, create, rotate, remove, resolve,
    openVault: () => setOpen(true),
    closeVault: () => setOpen(false),
    canViewSecrets
  }), [credentials, canViewSecrets]);

  return (
    <VaultContext.Provider value={value}>
      {children}
      <CredentialVaultModal open={open} onClose={() => setOpen(false)} />
    </VaultContext.Provider>
  );
}

export function useCredentialVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error('CredentialVaultProvider missing');
  return ctx;
}
