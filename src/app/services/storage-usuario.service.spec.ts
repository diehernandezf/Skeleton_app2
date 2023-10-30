import { TestBed } from '@angular/core/testing';

import { StorageUsuarioService } from './storage-usuario.service';

describe('StorageUsuarioService', () => {
  let service: StorageUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
