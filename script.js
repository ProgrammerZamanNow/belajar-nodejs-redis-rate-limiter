import http from 'k6/http';
import { check, sleep } from 'k6';

// Daftar token dari database
const tokens = [
  '2990fcff-28f9-474b-b58e-ec0c36c4aca2',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b2c3d4e5-f6g7-8901-bcde-f23456789012',
  'c3d4e5f6-g7h8-9012-cdef-345678901234',
  'd4e5f6g7-h8i9-0123-defg-456789012345',
  'e5f6g7h8-i9j0-1234-efgh-567890123456',
  'f6g7h8i9-j0k1-2345-fghi-678901234567',
  'g7h8i9j0-k1l2-3456-ghij-789012345678',
  'h8i9j0k1-l2m3-4567-hijk-890123456789',
  'i9j0k1l2-m3n4-5678-ijkl-901234567890',
  'j0k1l2m3-n4o5-6789-jklm-012345678901',
  'k1l2m3n4-o5p6-7890-klmn-123456789012',
  'l2m3n4o5-p6q7-8901-lmno-234567890123',
  'm3n4o5p6-q7r8-9012-mnop-345678901234',
  'n4o5p6q7-r8s9-0123-nopq-456789012345',
  'o5p6q7r8-s9t0-1234-opqr-567890123456',
  'p6q7r8s9-t0u1-2345-pqrs-678901234567',
  'q7r8s9t0-u1v2-3456-qrst-789012345678',
  'r8s9t0u1-v2w3-4567-rstu-890123456789',
  's9t0u1v2-w3x4-5678-stuv-901234567890',
  't0u1v2w3-x4y5-6789-tuvw-012345678901',
  'u1v2w3x4-y5z6-7890-uvwx-123456789012',
  'v2w3x4y5-z6a7-8901-vwxy-234567890123',
  'w3x4y5z6-a7b8-9012-wxyz-345678901234',
  'x4y5z6a7-b8c9-0123-xyza-456789012345',
  'y5z6a7b8-c9d0-1234-yzab-567890123456',
  'z6a7b8c9-d0e1-2345-zabc-678901234567',
  'a7b8c9d0-e1f2-3456-abcd-789012345678',
  'b8c9d0e1-f2g3-4567-bcde-890123456789',
  'c9d0e1f2-g3h4-5678-cdef-901234567890',
  'd0e1f2g3-h4i5-6789-defg-012345678901',
  'e1f2g3h4-i5j6-7890-efgh-123456789012',
  'f2g3h4i5-j6k7-8901-fghi-234567890123',
  'g3h4i5j6-k7l8-9012-ghij-345678901234',
  'h4i5j6k7-l8m9-0123-hijk-456789012345',
  'i5j6k7l8-m9n0-1234-ijkl-567890123456',
  'j6k7l8m9-n0o1-2345-jklm-678901234567',
  'k7l8m9n0-o1p2-3456-klmn-789012345678',
  'l8m9n0o1-p2q3-4567-lmno-890123456789',
  'm9n0o1p2-q3r4-5678-mnop-901234567890',
  'n0o1p2q3-r4s5-6789-nopq-012345678901',
  'o1p2q3r4-s5t6-7890-opqr-123456789012',
  'p2q3r4s5-t6u7-8901-pqrs-234567890123',
  'q3r4s5t6-u7v8-9012-qrst-345678901234',
  'r4s5t6u7-v8w9-0123-rstu-456789012345',
  's5t6u7v8-w9x0-1234-stuv-567890123456',
  't6u7v8w9-x0y1-2345-tuvw-678901234567',
  'u7v8w9x0-y1z2-3456-uvwx-789012345678',
  'v8w9x0y1-z2a3-4567-vwxy-890123456789',
  'w9x0y1z2-a3b4-5678-wxyz-901234567890',
  'x0y1z2a3-b4c5-6789-xyza-012345678901',
  'y1z2a3b4-c5d6-7890-yzab-123456789012',
  'z2a3b4c5-d6e7-8901-zabc-234567890123',
  'a3b4c5d6-e7f8-9012-abcd-345678901234',
  'b4c5d6e7-f8g9-0123-bcde-456789012345',
  'c5d6e7f8-g9h0-1234-cdef-567890123456',
  'd6e7f8g9-h0i1-2345-defg-678901234567',
  'e7f8g9h0-i1j2-3456-efgh-789012345678',
  'f8g9h0i1-j2k3-4567-fghi-890123456789',
  'g9h0i1j2-k3l4-5678-ghij-901234567890',
  'h0i1j2k3-l4m5-6789-hijk-012345678901',
  'i1j2k3l4-m5n6-7890-ijkl-123456789012',
  'j2k3l4m5-n6o7-8901-jklm-234567890123',
  'k3l4m5n6-o7p8-9012-klmn-345678901234',
  'l4m5n6o7-p8q9-0123-lmno-456789012345',
  'm5n6o7p8-q9r0-1234-mnop-567890123456',
  'n6o7p8q9-r0s1-2345-nopq-678901234567',
  'o7p8q9r0-s1t2-3456-opqr-789012345678',
  'p8q9r0s1-t2u3-4567-pqrs-890123456789',
  'q9r0s1t2-u3v4-5678-qrst-901234567890',
  'r0s1t2u3-v4w5-6789-rstu-012345678901',
  's1t2u3v4-w5x6-7890-stuv-123456789012',
  't2u3v4w5-x6y7-8901-tuvw-234567890123',
  'u3v4w5x6-y7z8-9012-uvwx-345678901234',
  'v4w5x6y7-z8a9-0123-vwxy-456789012345',
  'w5x6y7z8-a9b0-1234-wxyz-567890123456',
  'x6y7z8a9-b0c1-2345-xyza-678901234567',
  'y7z8a9b0-c1d2-3456-yzab-789012345678',
  'z8a9b0c1-d2e3-4567-zabc-890123456789',
  'a9b0c1d2-e3f4-5678-abcd-901234567890',
  'b0c1d2e3-f4g5-6789-bcde-012345678901',
  'c1d2e3f4-g5h6-7890-cdef-123456789012',
  'd2e3f4g5-h6i7-8901-defg-234567890123',
  'e3f4g5h6-i7j8-9012-efgh-345678901234',
  'f4g5h6i7-j8k9-0123-fghi-456789012345',
  'g5h6i7j8-k9l0-1234-ghij-567890123456',
  'h6i7j8k9-l0m1-2345-hijk-678901234567',
  'i7j8k9l0-m1n2-3456-ijkl-789012345678',
  'j8k9l0m1-n2o3-4567-jklm-890123456789',
  'k9l0m1n2-o3p4-5678-klmn-901234567890',
  'l0m1n2o3-p4q5-6789-lmno-012345678901',
  'm1n2o3p4-q5r6-7890-mnop-123456789012',
  'n2o3p4q5-r6s7-8901-nopq-234567890123',
  'o3p4q5r6-s7t8-9012-opqr-345678901234',
  'p4q5r6s7-t8u9-0123-pqrs-456789012345',
  'q5r6s7t8-u9v0-1234-qrst-567890123456',
  'r6s7t8u9-v0w1-2345-rstu-678901234567',
  's7t8u9v0-w1x2-3456-stuv-789012345678',
  't8u9v0w1-x2y3-4567-tuvw-890123456789',
  'u9v0w1x2-y3z4-5678-uvwx-901234567890',
  'v0w1x2y3-z4a5-6789-vwxy-012345678901'
];

// Konfigurasi test
export const options = {
  vus: 100,
  duration: '60s',
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% request harus di bawah 2 detik
    http_req_failed: ['rate<0.55'],    // Error rate harus di bawah 55% (karena 50% akan kena rate limit)
    'checks{check_name:Success Request}': ['rate>0.45'], // Minimal 45% request sukses
    'checks{check_name:Rate Limited Request}': ['rate>0.45'], // Minimal 45% request kena rate limit
  },
};

export default function () {
  // Mendapatkan token unik untuk setiap VU
  const vuId = __VU - 1; // VU ID mulai dari 0
  const token = tokens[vuId % tokens.length]; // Menggunakan modulo untuk cycling jika VU > 101

  // Headers untuk request
  const headers = {
    'Accept': 'application/json',
    'Authorization': token,
  };

  // URL endpoint
  const url = 'http://localhost:3000/api/users/current';

  // Mengirim 4 request secara bersamaan menggunakan http.batch
  // Rate limit 2 req/sec, jadi 2 request pertama sukses, 2 request berikutnya kena rate limit
  const responses = http.batch([
    ['GET', url, null, { headers: headers }],
    ['GET', url, null, { headers: headers }],
    ['GET', url, null, { headers: headers }],
    ['GET', url, null, { headers: headers }]
  ]);

  // Check untuk setiap request
  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];

    check(response, {
      'Success Request': (r) => r.status === 200,
      'Rate Limited Request': (r) => r.status === 429,
      'Response time < 2000ms': (r) => r.timings.duration < 2000,
    });
  }

  // Tunggu 1 detik sebelum iterasi berikutnya (menunggu rate limiter reset)
  sleep(1);
}

// Setup function (opsional) - berjalan sekali di awal test
export function setup() {
  return {};
}

// Teardown function (opsional) - berjalan sekali di akhir test
export function teardown(data) {
}