from app import create_app
from database import db
import json

app = create_app()

def test_endpoints():
    with app.test_client() as client:
        # 1. Health check
        res = client.get('/api/health')
        assert res.status_code == 200, f"Health check failed: {res.data}"
        print("[PASS] Health check passed:", res.get_json()['service'])

        # 2. Public services list
        res = client.get('/api/services')
        assert res.status_code == 200
        data = res.get_json()
        print(f"[PASS] Services list passed: {data['count']} services retrieved")

        # 3. Public track application
        res = client.get('/api/applications/track/RMN-2026-00125')
        assert res.status_code == 200
        track_data = res.get_json()['application']
        print(f"[PASS] Public track passed: Status is '{track_data['status']}' for {track_data['service_name']}")

        # 4. Login as Admin
        res = client.post('/api/auth/login', json={
            'email': 'admin@remonorth.og.gov.ng',
            'password': 'Admin@Remo2026!'
        })
        assert res.status_code == 200
        login_data = res.get_json()
        admin_token = login_data['token']
        print(f"[PASS] Admin login passed: Role is '{login_data['user']['role']}'")

        # 5. Admin dashboard
        res = client.get('/api/admin/dashboard', headers={'Authorization': f'Bearer {admin_token}'})
        assert res.status_code == 200
        dash_data = res.get_json()
        print("[PASS] Admin dashboard passed. Total applications:", dash_data['metrics']['total_applications'])

        # 6. Citizen Login
        res = client.post('/api/auth/login', json={
            'email': 'ade.bello@example.com',
            'password': 'Citizen@Remo2026!'
        })
        assert res.status_code == 200
        citizen_token = res.get_json()['token']
        print("[PASS] Citizen login passed")

        # 7. Citizen applications list
        res = client.get('/api/applications', headers={'Authorization': f'Bearer {citizen_token}'})
        assert res.status_code == 200
        apps = res.get_json()['applications']
        print(f"[PASS] Citizen applications passed: Found {len(apps)} applications")

        # 8. Community reports list
        res = client.get('/api/reports')
        assert res.status_code == 200
        reports = res.get_json()['reports']
        print(f"[PASS] Community reports passed: Found {len(reports)} geo-tagged reports in Remo North")

    print("\nALL BACKEND REST API ENDPOINT TESTS PASSED WITH 100% SUCCESS!")

if __name__ == '__main__':
    test_endpoints()
