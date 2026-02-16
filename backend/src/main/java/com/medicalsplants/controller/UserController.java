
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import com.medicalsplants.security.CustomUserDetails;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    // ... autres dépendances

    public UserController(UserService userService /*, autres dépendances */) {
        this.userService = userService;
        // ... initialisation autres dépendances
    }

    // Suppression hard (admin uniquement)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUserAsAdmin(
            @PathVariable UUID id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        userService.deleteUser(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    // Suppression soft (l’utilisateur sur lui-même)
    @DeleteMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteOwnAccount(
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        userService.deleteUser(currentUser.getId(), currentUser);
        return ResponseEntity.noContent().build();
    }

}
